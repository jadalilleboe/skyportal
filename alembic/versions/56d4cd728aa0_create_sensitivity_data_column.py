"""create sensitivity data column

Revision ID: 56d4cd728aa0
Revises: 46a40b35cdbb
Create Date: 2022-02-15 12:49:42.311680

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '56d4cd728aa0'
down_revision = '46a40b35cdbb'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        'instruments',
        sa.Column(
            'sensitivity_data', postgresql.JSONB(astext_type=sa.Text()), nullable=True
        ),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('instruments', 'sensitivity_data')
    # ### end Alembic commands ###
