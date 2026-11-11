import test from 'node:test';
import assert from 'node:assert/strict';
import { executeDeterministicReconstruction } from './reconstruction.js';
import { storage } from './storage.js';
import { DEMO_SOURCES } from '../data/demoData.js';

test('Knowledge reconstruction identifies conflict between Redis and PostgreSQL session store', () => {
  const result = executeDeterministicReconstruction('proj_test', DEMO_SOURCES);
  
  const conflictingDecision = result.decisions.find(d => d.verificationStatus === 'conflicting');
  assert.ok(conflictingDecision, 'Should extract a conflicting decision');
  assert.match(conflictingDecision.title, /Conflicting Session Store/i);
  assert.match(conflictingDecision.reasoning, /save \$450/i);

  const conflictingRisk = result.risks.find(r => r.title.includes('Conflicting Architectural Specifications'));
  assert.ok(conflictingRisk, 'Should extract a risk regarding conflicting session store specs');
});

test('Knowledge reconstruction marks missing task ownership and missing deadlines accurately', () => {
  const result = executeDeterministicReconstruction('proj_test', DEMO_SOURCES);
  
  const unassignedTask = result.tasks.find(t => t.name.includes('Campus SSO Security Audit'));
  assert.ok(unassignedTask, 'Should extract Campus SSO security audit task');
  assert.equal(unassignedTask.owner, 'Unassigned / Missing Owner');
  assert.equal(unassignedTask.deadline, 'Missing Deadline');
  assert.equal(unassignedTask.verificationStatus, 'missing');
});

test('Knowledge reconstruction extracts single-person knowledge bottlenecks and critical risks', () => {
  const result = executeDeterministicReconstruction('proj_test', DEMO_SOURCES);
  
  const sshRisk = result.risks.find(r => r.title.includes('Single-Person Knowledge Bottleneck'));
  assert.ok(sshRisk, 'Should identify SSH key knowledge bottleneck');
  assert.equal(sshRisk.severity, 'critical');
  assert.match(sshRisk.supportingEvidence, /personal laptop/i);
});

test('Absence Drill accurately flags Alex Rivera dependencies and computes realistic readiness score', () => {
  const drillResult = storage.runAbsenceDrill('proj_campus_portal', 'Alex Rivera');

  assert.equal(drillResult.personName, 'Alex Rivera');
  assert.ok(drillResult.tasksAtRisk.length > 0, 'Should identify tasks at risk for Alex');
  assert.ok(drillResult.undocumentedAreas.length > 0, 'Should flag undocumented SSH keys and scripts');
  assert.ok(drillResult.readinessScore < 70, 'Readiness score should be impacted due to knowledge dependencies');
  assert.ok(drillResult.mitigationChecklist.length >= 3, 'Should generate actionable mitigations');
});

test('Handover lifecycle: claim editing, approval status, and successor acknowledgement work seamlessly', () => {
  storage.resetDemoData();
  const handovers = storage.getHandovers('proj_campus_portal');
  assert.ok(handovers.length > 0, 'Should load demo handover');
  
  const hId = handovers[0].id;
  const firstClaim = handovers[0].claims[0];

  // Update claim
  const updatedHandover = storage.updateHandoverClaim(
    hId,
    firstClaim.id,
    { isApproved: true, reviewerNotes: 'Advisor confirmed Next.js 15 deployment' },
    'Dr. Sarah Chen'
  );
  assert.ok(updatedHandover, 'Handover should update successfully');
  const updatedClaim = updatedHandover.claims.find(c => c.id === firstClaim.id);
  assert.equal(updatedClaim?.isApproved, true);
  assert.equal(updatedClaim?.reviewerNotes, 'Advisor confirmed Next.js 15 deployment');

  // Transition to approved
  const approved = storage.updateHandoverStatus(hId, 'approved', 'Dr. Sarah Chen', 'reviewer', 'All claims verified');
  assert.equal(approved?.status, 'approved');
  assert.ok(approved?.approvedAt);

  // Successor acknowledgement
  const acknowledged = storage.acknowledgeHandover(
    hId,
    'Jordan Lee',
    'Received all credentials and accepted responsibilities.',
    ['chk_01', 'chk_02']
  );
  assert.equal(acknowledged?.status, 'acknowledged');
  assert.equal(acknowledged?.successorSignoffNote, 'Received all credentials and accepted responsibilities.');
  assert.equal(acknowledged?.readinessChecklist[0].completed, true);
});
