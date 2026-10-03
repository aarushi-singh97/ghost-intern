"""Document the baseline SQLite schema used by Ghost Intern.

Revision ID: 20261003_initial_schema
Revises:
Create Date: 2026-10-03
"""

from alembic import op
import sqlalchemy as sa

revision = "20261003_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Existing installations are initialized by app.database.init_db. New
    # deployments should apply this migration before starting the API.
    op.create_table(
        "users",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("username", sa.Text, nullable=False, unique=True),
        sa.Column("email", sa.Text, nullable=False, unique=True),
        sa.Column("hashed_password", sa.Text, nullable=False),
        sa.Column("created_at", sa.Text, nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
    )


def downgrade():
    op.drop_table("users")
