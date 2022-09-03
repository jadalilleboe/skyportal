"""MMADetectorSpectrum migration

Revision ID: 4822ff118a4f
Revises: 2c856b2845f2
Create Date: 2022-09-01 12:07:44.450979

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql as psql
import numpy as np

# revision identifiers, used by Alembic.
revision = '4822ff118a4f'
down_revision = '2c856b2845f2'
branch_labels = None
depends_on = None


class NumpyArray(sa.types.TypeDecorator):
    """SQLAlchemy representation of a NumPy array."""

    impl = psql.ARRAY(sa.Float)

    def process_result_value(self, value, dialect):
        return np.array(value)


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        'detector_spectra',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('modified', sa.DateTime(), nullable=False),
        sa.Column('frequencies', NumpyArray(), nullable=False),
        sa.Column('amplitudes', NumpyArray(), nullable=False),
        sa.Column('start_time', sa.DateTime(), nullable=False),
        sa.Column('end_time', sa.DateTime(), nullable=False),
        sa.Column('detector_id', sa.Integer(), nullable=False),
        sa.Column('owner_id', sa.Integer(), nullable=False),
        sa.Column('original_file_string', sa.String(), nullable=True),
        sa.Column('original_file_filename', sa.String(), nullable=True),
        sa.ForeignKeyConstraint(
            ['detector_id'], ['mmadetectors.id'], ondelete='CASCADE'
        ),
        sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(
        op.f('ix_detector_spectra_created_at'),
        'detector_spectra',
        ['created_at'],
        unique=False,
    )
    op.create_index(
        op.f('ix_detector_spectra_detector_id'),
        'detector_spectra',
        ['detector_id'],
        unique=False,
    )
    op.create_index(
        op.f('ix_detector_spectra_owner_id'),
        'detector_spectra',
        ['owner_id'],
        unique=False,
    )
    op.create_table(
        'group_mmadetector_spectra',
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('modified', sa.DateTime(), nullable=False),
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('group_id', sa.Integer(), nullable=False),
        sa.Column('detector_spectr_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ['detector_spectr_id'], ['detector_spectra.id'], ondelete='CASCADE'
        ),
        sa.ForeignKeyConstraint(['group_id'], ['groups.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(
        'group_mmadetector_spectra_forward_ind',
        'group_mmadetector_spectra',
        ['group_id', 'detector_spectr_id'],
        unique=True,
    )
    op.create_index(
        'group_mmadetector_spectra_reverse_ind',
        'group_mmadetector_spectra',
        ['detector_spectr_id', 'group_id'],
        unique=False,
    )
    op.create_index(
        op.f('ix_group_mmadetector_spectra_created_at'),
        'group_mmadetector_spectra',
        ['created_at'],
        unique=False,
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(
        op.f('ix_group_mmadetector_spectra_created_at'),
        table_name='group_mmadetector_spectra',
    )
    op.drop_index(
        'group_mmadetector_spectra_reverse_ind', table_name='group_mmadetector_spectra'
    )
    op.drop_index(
        'group_mmadetector_spectra_forward_ind', table_name='group_mmadetector_spectra'
    )
    op.drop_table('group_mmadetector_spectra')
    op.drop_index(op.f('ix_detector_spectra_owner_id'), table_name='detector_spectra')
    op.drop_index(
        op.f('ix_detector_spectra_detector_id'), table_name='detector_spectra'
    )
    op.drop_index(op.f('ix_detector_spectra_created_at'), table_name='detector_spectra')
    op.drop_table('detector_spectra')
    # ### end Alembic commands ###
