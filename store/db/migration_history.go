package db

import (
	"context"
	"strings"
)

type MigrationHistory struct {
	Version   string
	CreatedTs int64
}

type MigrationHistoryUpsert struct {
	Version string
}

type MigrationHistoryFind struct {
	Version *string
}

func (db *DB) FindMigrationHistoryList(ctx context.Context, find *MigrationHistoryFind) ([]*MigrationHistory, error) {
	where, args := []string{"1 = 1"}, []any{}

	if v := find.Version; v != nil {
		where, args = append(where, "version = ?"), append(args, *v)
	}

	stmt := `
		SELECT 
			version,
			created_ts
		FROM
			migration_history
		WHERE ` + strings.Join(where, " AND ") + `
		ORDER BY created_ts DESC
	`
	rows, err := db.DBInstance.QueryContext(ctx, stmt, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	migrationHistoryList := make([]*MigrationHistory, 0)
	for rows.Next() {
		var migrationHistory MigrationHistory
		if err := rows.Scan(
			&migrationHistory.Version,
			&migrationHistory.CreatedTs,
		); err != nil {
			return nil, err
		}
		migrationHistoryList = append(migrationHistoryList, &migrationHistory)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return migrationHistoryList, nil
}

func (db *DB) UpsertMigrationHistory(ctx context.Context, upsert *MigrationHistoryUpsert) (*MigrationHistory, error) {
	query := `
		INSERT INTO migration_history (
			version
		)
		VALUES (?)
		ON CONFLICT(version) DO UPDATE
		SET
			version=EXCLUDED.version
		RETURNING version, created_ts
	`
	migrationHistory := &MigrationHistory{}
	if err := db.DBInstance.QueryRowContext(ctx, query, upsert.Version).Scan(
		&migrationHistory.Version,
		&migrationHistory.CreatedTs,
	); err != nil {
		return nil, err
	}

	return migrationHistory, nil
}
