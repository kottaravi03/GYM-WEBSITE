#!/usr/bin/env python3
"""
Pet Community Platform - Test Suite Runner
Orchestrates backend, frontend, and Playwright tests
"""

import subprocess
import time
import os
import sys
import signal
import json
from datetime import datetime
from pathlib import Path

class TestRunner:
    def __init__(self):
        self.backend_process = None
        self.frontend_process = None
        self.test_results = {
            'timestamp': datetime.now().isoformat(),
            'tests': [],
            'summary': {}
        }
        self.root_dir = Path(__file__).parent

    def log(self, message, level="INFO"):
        """Log messages with timestamp"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] [{level}] {message}")

    def run_command(self, cmd, cwd=None, shell=False):
        """Run a command and return result"""
        try:
            result = subprocess.run(
                cmd,
                cwd=cwd or self.root_dir,
                shell=shell,
                capture_output=True,
                text=True,
                timeout=30
            )
            return {
                'success': result.returncode == 0,
                'stdout': result.stdout,
                'stderr': result.stderr,
                'returncode': result.returncode
            }
        except subprocess.TimeoutExpired:
            return {
                'success': False,
                'stdout': '',
                'stderr': 'Command timed out',
                'returncode': -1
            }
        except Exception as e:
            return {
                'success': False,
                'stdout': '',
                'stderr': str(e),
                'returncode': -1
            }

    def setup_backend(self):
        """Setup backend dependencies"""
        self.log("Setting up backend dependencies...")
        result = self.run_command(
            ['pip', 'install', '-q', 'fastapi', 'uvicorn', 'pydantic', 'python-multipart'],
            cwd=self.root_dir / 'backend'
        )
        
        if result['success']:
            self.log("Backend dependencies installed successfully", "SUCCESS")
            return True
        else:
            self.log(f"Failed to install backend dependencies: {result['stderr']}", "ERROR")
            return False

    def setup_frontend(self):
        """Setup frontend dependencies"""
        self.log("Setting up frontend dependencies...")
        result = self.run_command(
            ['npm', 'install', '--legacy-peer-deps'],
            cwd=self.root_dir / 'frontend'
        )
        
        if result['success']:
            self.log("Frontend dependencies installed successfully", "SUCCESS")
            return True
        else:
            self.log(f"Failed to install frontend dependencies: {result['stderr']}", "ERROR")
            return False

    def setup_playwright(self):
        """Setup Playwright"""
        self.log("Installing Playwright browsers...")
        result = self.run_command(['npx', 'playwright', 'install', '--with-deps'])
        
        if result['success']:
            self.log("Playwright browsers installed successfully", "SUCCESS")
            return True
        else:
            self.log(f"Failed to install Playwright: {result['stderr']}", "ERROR")
            return False

    def start_backend(self):
        """Start FastAPI backend server"""
        self.log("Starting FastAPI backend server on port 8000...")
        try:
            self.backend_process = subprocess.Popen(
                ['python', '-m', 'uvicorn', 'main:app', '--reload', '--port', '8000'],
                cwd=self.root_dir / 'backend',
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            time.sleep(3)
            
            if self.backend_process.poll() is None:
                self.log("Backend server started successfully", "SUCCESS")
                return True
            else:
                self.log("Backend server failed to start", "ERROR")
                return False
        except Exception as e:
            self.log(f"Failed to start backend: {str(e)}", "ERROR")
            return False

    def start_frontend(self):
        """Start React frontend server"""
        self.log("Starting React frontend server on port 3000...")
        try:
            self.frontend_process = subprocess.Popen(
                ['npm', 'start'],
                cwd=self.root_dir / 'frontend',
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                env={**os.environ, 'BROWSER': 'none'}
            )
            time.sleep(5)
            
            if self.frontend_process.poll() is None:
                self.log("Frontend server started successfully", "SUCCESS")
                return True
            else:
                self.log("Frontend server failed to start", "ERROR")
                return False
        except Exception as e:
            self.log(f"Failed to start frontend: {str(e)}", "ERROR")
            return False

    def run_api_tests(self):
        """Run API tests"""
        self.log("Running API tests...")
        result = self.run_command(
            ['npx', 'playwright', 'test', 'tests/api.spec.js', '--reporter=json'],
            cwd=self.root_dir
        )
        
        test_result = {
            'name': 'API Tests',
            'success': result['success'],
            'returncode': result['returncode'],
            'timestamp': datetime.now().isoformat()
        }
        
        if result['success']:
            self.log("API tests passed", "SUCCESS")
        else:
            self.log(f"API tests failed: {result['stderr']}", "ERROR")
        
        self.test_results['tests'].append(test_result)
        return result['success']

    def run_ui_tests(self):
        """Run UI tests"""
        self.log("Running UI tests...")
        result = self.run_command(
            ['npx', 'playwright', 'test', 'tests/app.spec.js', '--reporter=json'],
            cwd=self.root_dir
        )
        
        test_result = {
            'name': 'UI Tests',
            'success': result['success'],
            'returncode': result['returncode'],
            'timestamp': datetime.now().isoformat()
        }
        
        if result['success']:
            self.log("UI tests passed", "SUCCESS")
        else:
            self.log(f"UI tests failed: {result['stderr']}", "ERROR")
        
        self.test_results['tests'].append(test_result)
        return result['success']

    def cleanup(self):
        """Cleanup - stop servers"""
        self.log("Cleaning up...")
        
        if self.backend_process and self.backend_process.poll() is None:
            self.log("Stopping backend server...")
            self.backend_process.terminate()
            try:
                self.backend_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.backend_process.kill()
        
        if self.frontend_process and self.frontend_process.poll() is None:
            self.log("Stopping frontend server...")
            self.frontend_process.terminate()
            try:
                self.frontend_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.frontend_process.kill()
        
        self.log("Cleanup completed", "SUCCESS")

    def generate_report(self):
        """Generate test report"""
        passed = sum(1 for t in self.test_results['tests'] if t['success'])
        total = len(self.test_results['tests'])
        
        self.test_results['summary'] = {
            'total_tests': total,
            'passed': passed,
            'failed': total - passed,
            'success_rate': f"{(passed/total*100):.1f}%" if total > 0 else "0%"
        }
        
        report_path = self.root_dir / 'test_report.json'
        with open(report_path, 'w') as f:
            json.dump(self.test_results, f, indent=2)
        
        self.log(f"Test report saved to {report_path}", "SUCCESS")
        return self.test_results

    def run_all_tests(self):
        """Run complete test suite"""
        self.log("=" * 70)
        self.log("Pet Community Platform - Test Suite", "INFO")
        self.log("=" * 70)
        
        try:
            # Setup phase
            self.log("\n[PHASE 1] Setting up dependencies...", "INFO")
            if not self.setup_backend():
                self.log("Backend setup failed", "ERROR")
                return False
            
            if not self.setup_frontend():
                self.log("Frontend setup failed", "ERROR")
                return False
            
            if not self.setup_playwright():
                self.log("Playwright setup failed", "ERROR")
                return False
            
            # Start servers
            self.log("\n[PHASE 2] Starting servers...", "INFO")
            if not self.start_backend():
                self.log("Failed to start backend", "ERROR")
                return False
            
            if not self.start_frontend():
                self.log("Failed to start frontend", "ERROR")
                return False
            
            # Run tests
            self.log("\n[PHASE 3] Running tests...", "INFO")
            api_success = self.run_api_tests()
            ui_success = self.run_ui_tests()
            
            # Generate report
            self.log("\n[PHASE 4] Generating report...", "INFO")
            report = self.generate_report()
            
            # Print summary
            self.log("\n" + "=" * 70)
            self.log("TEST SUMMARY", "INFO")
            self.log("=" * 70)
            self.log(f"Total Tests: {report['summary']['total_tests']}")
            self.log(f"Passed: {report['summary']['passed']}")
            self.log(f"Failed: {report['summary']['failed']}")
            self.log(f"Success Rate: {report['summary']['success_rate']}")
            self.log("=" * 70)
            
            return api_success and ui_success
            
        except KeyboardInterrupt:
            self.log("\nTest suite interrupted by user", "WARNING")
            return False
        except Exception as e:
            self.log(f"Unexpected error: {str(e)}", "ERROR")
            return False
        finally:
            self.cleanup()

def main():
    runner = TestRunner()
    success = runner.run_all_tests()
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
