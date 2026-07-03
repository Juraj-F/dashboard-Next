INSERT INTO users (name, email, password_hash, role, department)
VALUES
('Warehouse Operator', 'operator@example.com', '$2a$10$wH8M7d6CtEKb6Jn4XeYmde8/9Ndzb7xvmilMIqHftprvQmMujwDum', 'operator', 'operations'),
('Inventory Supervisor', 'supervisor@example.com', '$2a$10$wH8M7d6CtEKb6Jn4XeYmde8/9Ndzb7xvmilMIqHftprvQmMujwDum', 'supervisor', 'inventory');

INSERT INTO tasks (title, description, status, priority, zone, department, assigned_to, created_by)
VALUES
('Move pallet A-102', 'Move pallet from receiving to storage zone B.', 'open', 'high', 'Receiving', 'operations', 1, 1),
('Inventory cycle count', 'Verify SKU quantities in aisle 4.', 'in_progress', 'medium', 'Zone B', 'inventory', 2, 2),
('Charge AMR unit 14', 'Move robot 14 to charging station.', 'completed', 'low', 'Charging', 'operations', 1, 1),
('Blocked conveyor check', 'Inspect conveyor belt in packing area.', 'blocked', 'high', 'Packing', 'maintenance', null, 1);
