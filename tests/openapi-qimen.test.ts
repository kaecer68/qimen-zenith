import test from 'node:test';
import assert from 'node:assert/strict';

import {
  parseContractDatetime,
  toContractAnalyzeResponse,
  toContractCalculateResponse,
} from '../src/lib/openapi-qimen.ts';

test('parseContractDatetime returns local date and hour from ISO datetime', () => {
  assert.deepEqual(
    parseContractDatetime('2026-03-18T10:30:00+08:00'),
    { date: '2026-03-18', hour: 10 }
  );
});

test('parseContractDatetime rejects invalid datetime strings', () => {
  assert.throws(
    () => parseContractDatetime('2026/03/18 10:30'),
    /datetime 格式錯誤/
  );
});

test('toContractCalculateResponse maps palace and enhanced fields', () => {
  const response = toContractCalculateResponse({
    plate: {
      yin_yang: '陽遁',
      stars_plate: { '1': '天蓬星' },
      human_plate: { '1': '休門' },
      spirit_plate: { '1': '值符' },
    },
    palace_ratings_enhanced: [
      {
        palace_index: 0,
        palace_name: '坎宮',
        overall_score: 88,
        wealth_score: 90,
        career_score: 70,
        health_score: 65,
        relationship_score: 80,
        study_score: 75,
      },
    ],
    palace_info: {
      current_hour_palace: 3,
      current_hour_palace_name: '震宮',
      wealth_palace: 8,
      wealth_palace_name: '艮宮',
      career_palace: 6,
      career_palace_name: '乾宮',
    },
  });

  assert.equal(response.chart_type, '陽遁');
  assert.equal(response.plate.palaces[0].name, '坎宮');
  assert.equal(response.plate.palaces[0].star, '天蓬星');
  assert.equal(response.plate.palaces[0].door, '休門');
  assert.equal(response.plate.palaces[0].deity, '值符');
  assert.equal(response.palace_ratings_enhanced[0].overall_score, 88);
  assert.equal(response.palace_info.current_hour_palace_name, '震宮');
});

test('toContractAnalyzeResponse maps summary and palace ratings', () => {
  const response = toContractAnalyzeResponse({
    analysis: {
      overall_level: '吉',
      recommendations: ['宜守正', '可緩進'],
      palace_ratings: {
        '1': { level: '吉', direction: '北' },
      },
    },
    palace_ratings_enhanced: [
      {
        palace_index: 0,
        palace_name: '坎宮',
        overall_score: 81,
        wealth_score: 83,
        career_score: 79,
        health_score: 74,
        relationship_score: 78,
        study_score: 76,
      },
    ],
  });

  assert.equal(response.overall, '宜守正');
  assert.equal(response.specific_advice, '宜守正；可緩進');
  assert.deepEqual(response.palace_ratings, [
    { palace_index: 1, level: '吉', direction: '北' },
  ]);
  assert.equal(response.palace_ratings_enhanced[0].palace_name, '坎宮');
});
