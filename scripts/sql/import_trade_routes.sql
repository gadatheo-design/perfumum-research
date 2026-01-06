INSERT INTO trade_routes 
    (route_id, name, time_start, time_end, nodes, materials, notes, sources, axis_id)
  VALUES
    (
      'TR_001',
      'Route olfactive 1 (seed)',
      200,
      1900,
      '[{"place": "Chios", "lat": 38.37, "lon": 26.14, "role": "source"}, {"place": "Istanbul", "lat": 41.01, "lon": 28.97, "role": "hub"}]',
      '["mastic","labdanum","frankincense"]',
      'seed',
      '[]',
      'AX2_ETHNOBOTANY_COMP'
    ),
    (
      'TR_002',
      'Route olfactive 2 (seed)',
      -500,
      1900,
      '[{"place": "Chios", "lat": 38.37, "lon": 26.14, "role": "source"}, {"place": "Istanbul", "lat": 41.01, "lon": 28.97, "role": "hub"}]',
      '["mastic","labdanum","frankincense"]',
      'seed',
      '[]',
      'AX2_ETHNOBOTANY_COMP'
    ),
    (
      'TR_003',
      'Route olfactive 3 (seed)',
      1200,
      1700,
      '[{"place": "Chios", "lat": 38.37, "lon": 26.14, "role": "source"}, {"place": "Istanbul", "lat": 41.01, "lon": 28.97, "role": "hub"}]',
      '["mastic","labdanum","frankincense"]',
      'seed',
      '[]',
      'AX2_ETHNOBOTANY_COMP'
    ),
    (
      'TR_004',
      'Route olfactive 4 (seed)',
      1500,
      1900,
      '[{"place": "Chios", "lat": 38.37, "lon": 26.14, "role": "source"}, {"place": "Istanbul", "lat": 41.01, "lon": 28.97, "role": "hub"}]',
      '["mastic","labdanum","frankincense"]',
      'seed',
      '[]',
      'AX2_ETHNOBOTANY_COMP'
    ),
    (
      'TR_005',
      'Route olfactive 5 (seed)',
      1500,
      1900,
      '[{"place": "Chios", "lat": 38.37, "lon": 26.14, "role": "source"}, {"place": "Istanbul", "lat": 41.01, "lon": 28.97, "role": "hub"}]',
      '["mastic","labdanum","frankincense"]',
      'seed',
      '[]',
      'AX2_ETHNOBOTANY_COMP'
    ),
    (
      'TR_006',
      'Route olfactive 6 (seed)',
      200,
      1800,
      '[{"place": "Chios", "lat": 38.37, "lon": 26.14, "role": "source"}, {"place": "Istanbul", "lat": 41.01, "lon": 28.97, "role": "hub"}]',
      '["mastic","labdanum","frankincense"]',
      'seed',
      '[]',
      'AX2_ETHNOBOTANY_COMP'
    )
  ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    time_start = VALUES(time_start),
    time_end = VALUES(time_end),
    nodes = VALUES(nodes),
    materials = VALUES(materials),
    notes = VALUES(notes),
    sources = VALUES(sources);