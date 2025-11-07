#!/usr/bin/env python
"""
Quick script to generate a Django SECRET_KEY for production use.
Run: python generate_secret_key.py
"""
from django.core.management.utils import get_random_secret_key

if __name__ == "__main__":
    secret_key = get_random_secret_key()
    print("\n" + "="*60)
    print("Your Django SECRET_KEY:")
    print("="*60)
    print(secret_key)
    print("="*60)
    print("\n⚠️  IMPORTANT: Copy this key and add it as an environment variable")
    print("   in your hosting platform (Render, Railway, etc.)")
    print("   Never commit this key to GitHub!\n")

