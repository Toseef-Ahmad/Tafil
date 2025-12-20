/**
 * Quick test to verify license is working
 */

const licensing = require('./licensing');

console.log('🧪 Testing License System...\n');

// Test 1: Check if license file exists
const hasLicense = licensing.hasLicenseFile();
console.log('1. Has license file:', hasLicense);

// Test 2: Load license
const license = licensing.loadLicense();
console.log('2. License loaded:', license ? 'YES' : 'NO');
if (license) {
  console.log('   - Has data:', !!license.data);
  console.log('   - Has payload:', !!license.payload);
  console.log('   - Has signature:', !!license.signature);
}

// Test 3: Verify license
const verification = licensing.verifyLicense();
console.log('\n3. Verification result:', verification.valid ? '✅ VALID' : '❌ INVALID');
console.log('   - Code:', verification.code);
console.log('   - Message:', verification.message);
if (verification.features) {
  console.log('   - Features:', verification.features);
}

// Test 4: Check isPro
const isPro = licensing.isPro();
console.log('\n4. Is Pro:', isPro ? '✅ YES' : '❌ NO');

// Test 5: Check specific actions
const actions = ['project.run', 'project.create', 'playground.execute', 'blueprint.edit', 'ssh.connect'];
console.log('\n5. Feature Access:');
actions.forEach(action => {
  const result = licensing.guardAction(action);
  console.log(`   - ${action}: ${result.allowed ? '✅ ALLOWED' : '❌ BLOCKED'}`);
  if (!result.allowed) {
    console.log(`     Reason: ${result.reason}`);
  }
});

// Test 6: Get license status
const status = licensing.getLicenseStatus();
console.log('\n6. License Status:');
console.log('   - Status:', status.status);
console.log('   - Message:', status.message);
console.log('   - Needs Activation:', status.needsActivation);
console.log('   - Is Pro:', status.isPro);

console.log('\n✅ Test complete!');
process.exit(0);

