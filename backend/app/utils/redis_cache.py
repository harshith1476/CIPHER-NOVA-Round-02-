"""
Redis Caching Layer for Performance Optimization
Optional: Works with or without Redis
"""

try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False

import json
import os
from datetime import timedelta
from functools import wraps


class RedisCache:
    """Redis cache manager for high-performance data caching"""
    
    def __init__(self):
        if not REDIS_AVAILABLE:
            self.enabled = False
            self.client = None
            return
            
        redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379')
        try:
            self.client = redis.from_url(redis_url, decode_responses=True, socket_connect_timeout=2)
            self.client.ping()
            self.enabled = True
            print(f"✓ Redis cache connected: {redis_url}")
        except Exception:
            # Silent fallback to in-memory cache
            self.enabled = False
            self.client = None
    
    def get(self, key):
        """Get value from cache"""
        if not self.enabled:
            return None
        
        try:
            value = self.client.get(key)
            if value:
                return json.loads(value)
        except Exception as e:
            print(f"Redis get error: {e}")
        
        return None
    
    def set(self, key, value, ttl=300):
        """
        Set value in cache
        
        Args:
            key: Cache key
            value: Value to cache (will be JSON serialized)
            ttl: Time to live in seconds (default: 300 = 5 minutes)
        """
        if not self.enabled:
            return False
        
        try:
            serialized = json.dumps(value)
            self.client.setex(key, ttl, serialized)
            return True
        except Exception as e:
            print(f"Redis set error: {e}")
            return False
    
    def delete(self, key):
        """Delete key from cache"""
        if not self.enabled:
            return False
        
        try:
            self.client.delete(key)
            return True
        except Exception as e:
            print(f"Redis delete error: {e}")
            return False
    
    def delete_pattern(self, pattern):
        """Delete all keys matching pattern"""
        if not self.enabled:
            return False
        
        try:
            keys = self.client.keys(pattern)
            if keys:
                self.client.delete(*keys)
            return True
        except Exception as e:
            print(f"Redis delete pattern error: {e}")
            return False
    
    def exists(self, key):
        """Check if key exists"""
        if not self.enabled:
            return False
        
        try:
            return self.client.exists(key) > 0
        except Exception as e:
            print(f"Redis exists error: {e}")
            return False
    
    def clear_all(self):
        """Clear all cache (use with caution!)"""
        if not self.enabled:
            return False
        
        try:
            self.client.flushdb()
            return True
        except Exception as e:
            print(f"Redis clear error: {e}")
            return False
    
    def get_stats(self):
        """Get cache statistics"""
        if not self.enabled:
            return {'enabled': False}
        
        try:
            info = self.client.info('stats')
            return {
                'enabled': True,
                'total_connections': info.get('total_connections_received', 0),
                'total_commands': info.get('total_commands_processed', 0),
                'keyspace_hits': info.get('keyspace_hits', 0),
                'keyspace_misses': info.get('keyspace_misses', 0),
                'hit_rate': self._calculate_hit_rate(
                    info.get('keyspace_hits', 0),
                    info.get('keyspace_misses', 0)
                )
            }
        except Exception as e:
            print(f"Redis stats error: {e}")
            return {'enabled': True, 'error': str(e)}
    
    def _calculate_hit_rate(self, hits, misses):
        """Calculate cache hit rate percentage"""
        total = hits + misses
        if total == 0:
            return 0.0
        return round((hits / total) * 100, 2)


# Global cache instance
cache = RedisCache()


def cached(ttl=300, key_prefix=''):
    """
    Decorator for caching function results
    
    Usage:
        @cached(ttl=600, key_prefix='recommendations')
        def get_recommendations(retailer_id):
            return expensive_computation()
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = f"{key_prefix}:{func.__name__}:{str(args)}:{str(kwargs)}"
            
            # Try to get from cache
            cached_value = cache.get(cache_key)
            if cached_value is not None:
                return cached_value
            
            # Execute function and cache result
            result = func(*args, **kwargs)
            cache.set(cache_key, result, ttl)
            
            return result
        
        return wrapper
    return decorator

