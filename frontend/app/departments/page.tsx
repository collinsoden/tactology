'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { graphqlRequest } from '../../lib/api';

interface SubDepartment {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
  subDepartments: SubDepartment[];
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function DepartmentsPage() {
  const token = useAuthStore((s) => s.token);
  const setToken = useAuthStore((s) => s.setToken);
  const router = useRouter();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [page, setPage] = useState(1);
  const [name, setName] = useState('');
  const [subNames, setSubNames] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, [token, router]);

  const loadDepartments = async (newPage = page) => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const data = await graphqlRequest<{
        getDepartments: { items: Department[]; meta: Meta };
      }>(
        `
        query GetDepartments($page: Int!, $limit: Int!) {
          getDepartments(pagination: { page: $page, limit: $limit }) {
            items {
              id
              name
              subDepartments {
                id
                name
              }
            }
            meta {
              total
              page
              limit
              totalPages
            }
          }
        }
      `,
        { page: newPage, limit: 5 },
        token,
      );
      setDepartments(data.getDepartments.items);
      setMeta(data.getDepartments.meta);
      setPage(newPage);
    } catch (err: any) {
      setError(err.message || 'Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadDepartments(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError('');
    setLoading(true);
    try {
      const subDepartments = subNames
        .map((n) => n.trim())
        .filter((n) => n.length > 0)
        .map((n) => ({ name: n }));

      await graphqlRequest(
        `
        mutation CreateDepartment($input: CreateDepartmentInput!) {
          createDepartment(input: $input) {
            id
          }
        }
      `,
        {
          input: {
            name,
            subDepartments: subDepartments.length ? subDepartments : null,
          },
        },
        token,
      );
      setName('');
      setSubNames(['']);
      await loadDepartments(1);
    } catch (err: any) {
      setError(err.message || 'Failed to create department');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (!confirm('Delete this department and all sub-departments?')) return;
    setLoading(true);
    setError('');
    try {
      await graphqlRequest(
        `
        mutation DeleteDepartment($id: Int!) {
          deleteDepartment(id: $id)
        }
      `,
        { id },
        token,
      );
      await loadDepartments(page);
    } catch (err: any) {
      setError(err.message || 'Failed to delete department');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    router.push('/');
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 380px) minmax(360px, 520px)',
        gap: 32,
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          padding: 24,
          borderRadius: 16,
          background: '#020617',
          border: '1px solid #1f2937',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <h2 style={{ fontSize: 20 }}>Create Department</h2>
          <button
            onClick={logout}
            style={{
              fontSize: 12,
              padding: '4px 10px',
              borderRadius: 999,
              border: '1px solid #4b5563',
              background: 'transparent',
              color: '#9ca3af',
              cursor: 'pointer',
            }}
          >
            Log out
          </button>
        </div>

        <form
          onSubmit={handleCreate}
          style={{ display: 'grid', gap: 12, marginTop: 8 }}
        >
          <label style={{ fontSize: 14 }}>
            Department name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                marginTop: 4,
                width: '100%',
                borderRadius: 8,
                padding: '8px 10px',
                border: '1px solid #1f2937',
                background: '#020617',
                color: '#e5e7eb',
              }}
              placeholder="Finance"
            />
          </label>

          <div style={{ fontSize: 14, marginTop: 8 }}>
            Sub-departments
            {subNames.map((value, idx) => (
              <input
                key={idx}
                value={value}
                onChange={(e) => {
                  const copy = [...subNames];
                  copy[idx] = e.target.value;
                  setSubNames(copy);
                }}
                style={{
                  marginTop: 4,
                  width: '100%',
                  borderRadius: 8,
                  padding: '8px 10px',
                  border: '1px solid #1f2937',
                  background: '#020617',
                  color: '#e5e7eb',
                }}
                placeholder={
                  idx === 0
                    ? 'Accounts (optional)'
                    : 'Another sub-department'
                }
              />
            ))}
            <button
              type="button"
              onClick={() => setSubNames([...subNames, ''])}
              style={{
                marginTop: 8,
                borderRadius: 999,
                padding: '4px 10px',
                border: 'none',
                background: '#1d4ed8',
                color: '#e5e7eb',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              + Add another
            </button>
          </div>

          {error && (
            <div style={{ color: '#fb7185', fontSize: 13 }}>{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8,
              borderRadius: 999,
              padding: '8px 0',
              border: 'none',
              background:
                'linear-gradient(135deg,#22c55e,#14b8a6,#3b82f6)',
              color: '#020617',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {loading ? 'Saving…' : 'Create'}
          </button>
        </form>
      </div>

      <div
        style={{
          padding: 24,
          borderRadius: 16,
          background: '#020617',
          border: '1px solid #1f2937',
          minHeight: 260,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <h2 style={{ fontSize: 20 }}>Departments</h2>
          <button
            onClick={() => loadDepartments(page)}
            style={{
              fontSize: 12,
              padding: '4px 10px',
              borderRadius: 999,
              border: '1px solid #4b5563',
              background: 'transparent',
              color: '#9ca3af',
              cursor: 'pointer',
            }}
          >
            Refresh
          </button>
        </div>

        {loading && !departments.length && (
          <div style={{ fontSize: 14, opacity: 0.7 }}>Loading…</div>
        )}

        {!loading && departments.length === 0 && (
          <div style={{ fontSize: 14, opacity: 0.7 }}>
            No departments yet. Create your first one on the left.
          </div>
        )}

        <div style={{ display: 'grid', gap: 10 }}>
          {departments.map((dept) => (
            <div
              key={dept.id}
              style={{
                borderRadius: 12,
                border: '1px solid #1f2937',
                padding: 12,
                background: '#020617',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 6,
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 500 }}>
                  #{dept.id} {dept.name}
                </div>
                <button
                  onClick={() => handleDelete(dept.id)}
                  style={{
                    fontSize: 11,
                    padding: '4px 8px',
                    borderRadius: 999,
                    border: 'none',
                    background: '#b91c1c',
                    color: '#fee2e2',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>
                {dept.subDepartments && dept.subDepartments.length > 0 ? (
                  <ul style={{ paddingLeft: 16, margin: 0 }}>
                    {dept.subDepartments.map((s) => (
                      <li key={s.id}>
                        #{s.id} {s.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span>No sub-departments</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {meta && meta.totalPages > 1 && (
          <div
            style={{
              marginTop: 16,
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 13,
            }}
          >
            <button
              disabled={page <= 1}
              onClick={() => loadDepartments(page - 1)}
              style={{
                padding: '4px 10px',
                borderRadius: 999,
                border: '1px solid #4b5563',
                background: 'transparent',
                color: '#9ca3af',
                cursor: page <= 1 ? 'not-allowed' : 'pointer',
              }}
            >
              ← Prev
            </button>
            <div>
              Page {meta.page} of {meta.totalPages} · {meta.total} total
            </div>
            <button
              disabled={page >= meta.totalPages}
              onClick={() => loadDepartments(page + 1)}
              style={{
                padding: '4px 10px',
                borderRadius: 999,
                border: '1px solid #4b5563',
                background: 'transparent',
                color: '#9ca3af',
                cursor:
                  page >= meta.totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
