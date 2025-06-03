"""add_inventory_models_for_page4

Revision ID: 3a31ce608338
Revises: 2a31ce608337
Create Date: 2025-06-02 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '3a31ce608338'
down_revision = '2a31ce608337'
branch_labels = None
depends_on = None


def upgrade():
    # Create traydata table
    op.create_table(
        'traydata',
        sa.Column('id', sa.String(length=50), nullable=False),
        sa.Column('container_id', sa.String(length=50), nullable=False),
        sa.Column('utilization_percentage', sa.Integer(), nullable=False),
        sa.Column('crop_count', sa.Integer(), nullable=False),
        sa.Column('utilization_level', sa.Enum('LOW', 'MEDIUM', 'HIGH', name='utilizationlevel'), nullable=False),
        sa.Column('rfid_tag', sa.String(length=255), nullable=False),
        sa.Column('shelf', sa.Enum('UPPER', 'LOWER', name='shelftype'), nullable=True),
        sa.Column('slot_number', sa.Integer(), nullable=True),
        sa.Column('is_on_shelf', sa.Boolean(), nullable=False, default=True),
        sa.Column('created', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['container_id'], ['container.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Create paneldata table
    op.create_table(
        'paneldata',
        sa.Column('id', sa.String(length=50), nullable=False),
        sa.Column('container_id', sa.String(length=50), nullable=False),
        sa.Column('utilization_percentage', sa.Integer(), nullable=False),
        sa.Column('crop_count', sa.Integer(), nullable=False),
        sa.Column('utilization_level', sa.Enum('LOW', 'MEDIUM', 'HIGH', name='utilizationlevel'), nullable=False),
        sa.Column('rfid_tag', sa.String(length=255), nullable=False),
        sa.Column('wall', sa.Enum('WALL_1', 'WALL_2', 'WALL_3', 'WALL_4', name='walltype'), nullable=True),
        sa.Column('slot_number', sa.Integer(), nullable=True),
        sa.Column('is_on_wall', sa.Boolean(), nullable=False, default=True),
        sa.Column('created', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['container_id'], ['container.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Create cropdata table
    op.create_table(
        'cropdata',
        sa.Column('id', sa.String(length=50), nullable=False),
        sa.Column('container_id', sa.String(length=50), nullable=False),
        sa.Column('tray_id', sa.String(length=50), nullable=True),
        sa.Column('panel_id', sa.String(length=50), nullable=True),
        sa.Column('seed_type', sa.String(length=255), nullable=False),
        sa.Column('age_days', sa.Integer(), nullable=False),
        sa.Column('seeded_date', sa.String(length=255), nullable=False),
        sa.Column('planned_transplanting_date', sa.String(length=255), nullable=True),
        sa.Column('transplanted_date', sa.String(length=255), nullable=True),
        sa.Column('planned_harvesting_date', sa.String(length=255), nullable=True),
        sa.Column('overdue_days', sa.Integer(), nullable=False, default=0),
        sa.Column('health_status', sa.Enum('HEALTHY', 'TREATMENT_REQUIRED', 'TO_BE_DISPOSED', name='healthstatus'), nullable=False),
        sa.Column('size', sa.Enum('SMALL', 'MEDIUM', 'LARGE', name='cropsize'), nullable=False),
        sa.Column('row', sa.Integer(), nullable=True),
        sa.Column('column', sa.Integer(), nullable=True),
        sa.Column('channel', sa.Integer(), nullable=True),
        sa.Column('position', sa.Integer(), nullable=True),
        sa.Column('created', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['container_id'], ['container.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['tray_id'], ['traydata.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['panel_id'], ['paneldata.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Insert mock data for container-04
    # Mock trays
    op.execute("""
        INSERT INTO traydata (id, container_id, utilization_percentage, crop_count, utilization_level, rfid_tag, shelf, slot_number, is_on_shelf, created)
        VALUES 
        ('TR-10-595383-3131', 'container-04', 85, 170, 'HIGH', 'A1B2C3D4', 'UPPER', 1, true, now() - interval '15 days'),
        ('TR-10-595383-3132', 'container-04', 60, 120, 'MEDIUM', 'E5F6G7H8', 'LOWER', 3, true, now() - interval '10 days'),
        ('TR-10-595383-3133', 'container-04', 30, 60, 'LOW', 'I9J0K1L2', null, null, false, now() - interval '5 days');
    """)

    # Mock panels
    op.execute("""
        INSERT INTO paneldata (id, container_id, utilization_percentage, crop_count, utilization_level, rfid_tag, wall, slot_number, is_on_wall, created)
        VALUES 
        ('PN-10-662850-5223', 'container-04', 75, 45, 'HIGH', 'J9K0L1M2', 'WALL_1', 1, true, now() - interval '20 days'),
        ('PN-10-662850-5224', 'container-04', 40, 20, 'LOW', 'N3O4P5Q6', 'WALL_2', 5, true, now() - interval '15 days'),
        ('PN-10-662850-5225', 'container-04', 90, 60, 'HIGH', 'R7S8T9U0', null, null, false, now() - interval '8 days');
    """)

    # Mock crops for tray
    op.execute("""
        INSERT INTO cropdata (id, container_id, tray_id, seed_type, row, column, age_days, seeded_date, planned_transplanting_date, overdue_days, health_status, size, created)
        VALUES 
        ('crop-nursery-001', 'container-04', 'TR-10-595383-3131', 'Someroots', 5, 10, 14, '2025-01-15', '2025-02-05', 0, 'HEALTHY', 'MEDIUM', now() - interval '14 days'),
        ('crop-nursery-002', 'container-04', 'TR-10-595383-3131', 'Someroots', 6, 11, 15, '2025-01-14', '2025-02-04', 0, 'HEALTHY', 'MEDIUM', now() - interval '15 days'),
        ('crop-nursery-003', 'container-04', 'TR-10-595383-3131', 'Someroots', 7, 12, 16, '2025-01-13', '2025-02-03', 0, 'HEALTHY', 'MEDIUM', now() - interval '16 days'),
        ('crop-nursery-004', 'container-04', 'TR-10-595383-3131', 'Someroots', 8, 13, 17, '2025-01-12', '2025-02-02', 1, 'TREATMENT_REQUIRED', 'MEDIUM', now() - interval '17 days'),
        ('crop-nursery-005', 'container-04', 'TR-10-595383-3131', 'Someroots', 9, 14, 18, '2025-01-11', '2025-02-01', 2, 'TREATMENT_REQUIRED', 'MEDIUM', now() - interval '18 days');
    """)

    # Mock crops for panel
    op.execute("""
        INSERT INTO cropdata (id, container_id, panel_id, seed_type, channel, position, age_days, seeded_date, transplanted_date, planned_harvesting_date, overdue_days, health_status, size, created)
        VALUES 
        ('crop-panel-1-01', 'container-04', 'PN-10-662850-5223', 'Basil', 1, 1, 29, '2024-12-05', '2024-12-19', '2025-02-28', 0, 'HEALTHY', 'MEDIUM', now() - interval '29 days'),
        ('crop-panel-1-02', 'container-04', 'PN-10-662850-5223', 'Basil', 1, 2, 30, '2024-12-04', '2024-12-18', '2025-02-27', 0, 'HEALTHY', 'MEDIUM', now() - interval '30 days'),
        ('crop-panel-1-03', 'container-04', 'PN-10-662850-5223', 'Basil', 1, 3, 31, '2024-12-03', '2024-12-17', '2025-02-26', 0, 'HEALTHY', 'MEDIUM', now() - interval '31 days'),
        ('crop-panel-2-01', 'container-04', 'PN-10-662850-5223', 'Lettuce', 2, 1, 29, '2024-12-05', '2024-12-19', '2025-02-28', 0, 'HEALTHY', 'MEDIUM', now() - interval '29 days'),
        ('crop-panel-2-02', 'container-04', 'PN-10-662850-5223', 'Lettuce', 2, 2, 30, '2024-12-04', '2024-12-18', '2025-02-27', 0, 'HEALTHY', 'MEDIUM', now() - interval '30 days'),
        ('crop-panel-3-01', 'container-04', 'PN-10-662850-5223', 'Spinach', 3, 1, 29, '2024-12-05', '2024-12-19', '2025-02-28', 0, 'HEALTHY', 'MEDIUM', now() - interval '29 days');
    """)


def downgrade():
    # Drop tables in reverse order (due to foreign key constraints)
    op.drop_table('cropdata')
    op.drop_table('paneldata')
    op.drop_table('traydata')
    
    # Drop custom enums
    op.execute('DROP TYPE IF EXISTS cropsize CASCADE')
    op.execute('DROP TYPE IF EXISTS healthstatus CASCADE')
    op.execute('DROP TYPE IF EXISTS walltype CASCADE')
    op.execute('DROP TYPE IF EXISTS shelftype CASCADE')
    op.execute('DROP TYPE IF EXISTS utilizationlevel CASCADE')