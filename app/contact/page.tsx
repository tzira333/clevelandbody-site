              {/* SUBMIT BUTTON - PURE INLINE STYLES */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '1rem 1.5rem',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    fontSize: '1.125rem',
                    backgroundColor: loading ? '#999999' : '#800000',
                    color: '#FFFFFF',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    transition: 'background-color 0.2s',
                    opacity: loading ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.backgroundColor = '#660000'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.backgroundColor = '#800000'
                    }
                  }}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
