#!/usr/bin/env python3
import subprocess
import json
import sys
from datetime import datetime

def run_tests():
    """Run Playwright tests and capture results"""
    print("Starting Playwright tests...")
    print("=" * 60)
    
    try:
        # Run API tests
        print("\n[1/2] Running API tests...")
        api_result = subprocess.run(
            ['npx', 'playwright', 'test', 'tests/api.spec.js', '--reporter=json'],
            capture_output=True,
            text=True,
            cwd='.'
        )
        
        # Run UI tests
        print("[2/2] Running UI tests...")
        ui_result = subprocess.run(
            ['npx', 'playwright', 'test', 'tests/app.spec.js', '--reporter=json'],
            capture_output=True,
            text=True,
            cwd='.'
        )
        
        print("\n" + "=" * 60)
        print("Tests completed!")
        
        return {
            'api_tests': api_result,
            'ui_tests': ui_result,
            'timestamp': datetime.now().isoformat()
        }
    except Exception as e:
        print(f"Error running tests: {e}")
        return None

if __name__ == '__main__':
    results = run_tests()
    if results:
        print("\nTest execution completed. Check issues.md for detailed results.")
