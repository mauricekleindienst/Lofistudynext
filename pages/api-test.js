import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import styles from '../styles/ApiTest.module.css';

export default function ApiTest() {
  const { session, user } = useAuth();
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [testData, setTestData] = useState({
    pomodoro: {
      duration: 25,
      completed: true,
      type: 'work',
      category: 'Studying',
      task_name: 'Test Task',
      notes: 'Test notes'
    },
    todo: {
      text: 'Test Todo Item',
      color: '#ff7b00'
    },
    note: {
      title: 'Test Note',
      content: 'This is a test note content'
    },
    event: {
      title: 'Test Event',
      date: new Date().toISOString().split('T')[0]
    },
    pomodoroCount: {
      increment: 1,
      category: 'Studying'
    },
    challenge: {
      title: 'Test Challenge',
      description: 'This is a test challenge description',
      points: 50,
      difficulty: 'medium'
    },
    challenge: {
      title: 'Test Challenge',
      description: 'This is a test challenge description',
      points: 10,
      difficulty: 'easy'
    }
  });

  const updateResult = (endpoint, data) => {
    const result = {
      timestamp: new Date().toLocaleTimeString(),
      data
    };
    
    setResults(prev => ({
      ...prev,
      [endpoint]: result
    }));

    // Also log to console for debugging
    console.group(`🧪 API Test: ${endpoint}`);
    console.log('Timestamp:', result.timestamp);
    console.log('Status:', data.status);
    console.log('Success:', data.success);
    console.log('Data:', data.data || data.error);
    console.groupEnd();
  };

  const setLoadingState = (endpoint, isLoading) => {
    setLoading(prev => ({
      ...prev,
      [endpoint]: isLoading
    }));
  };

  const apiCall = async (endpoint, method = 'GET', body = null) => {
    setLoadingState(endpoint, true);
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        }
      };
      
      if (body) {
        options.body = JSON.stringify(body);
      }

      console.log(`Making ${method} request to /api/${endpoint}`, body ? { body } : '');
      
      const response = await fetch(`/api/${endpoint}`, options);
      let data;
      
      try {
        data = await response.json();
      } catch (parseError) {
        data = { error: 'Failed to parse response as JSON', response: await response.text() };
      }
      
      updateResult(endpoint, {
        status: response.status,
        success: response.ok,
        data,
        method,
        endpoint: `/api/${endpoint}`,
        requestBody: body,
        user: user || session?.user
      });
    } catch (error) {
      console.error(`API call error for ${endpoint}:`, error);
      updateResult(endpoint, {
        status: 'ERROR',
        success: false,
        error: error.message,
        method,
        endpoint: `/api/${endpoint}`,
        requestBody: body,
        user: user || session?.user
      });
    }
    setLoadingState(endpoint, false);
  };

  const updateTestData = (category, field, value) => {
    setTestData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Copied to clipboard!');
    }
  };

  const formatResultForCopy = (endpoint, result) => {
    return `🧪 API Test Result - ${endpoint}
=====================================
Timestamp: ${result.timestamp}
Method: ${result.data.method || 'GET'}
Endpoint: ${result.data.endpoint || `/api/${endpoint}`}
Status: ${result.data.status}
Success: ${result.data.success ? '✅ Yes' : '❌ No'}

${result.data.method === 'POST' || result.data.method === 'PUT' ? `📨 REQUEST DATA:
${result.data.requestBody ? JSON.stringify(result.data.requestBody, null, 2) : 'No request body'}

` : ''}📄 RESPONSE DATA:
${JSON.stringify(result.data.data || result.data.error || result.data, null, 2)}

🐛 DEBUG INFO:
- User: ${result.data.user?.email || 'Unknown'}
- Raw Status Code: ${result.data.status}
- Response OK: ${result.data.success}
- API Route: ${result.data.endpoint}
- Test Time: ${result.timestamp}

📋 COPY THIS TO SHARE WITH DEVELOPER
=====================================`;
  };

  const formatAllResultsForCopy = () => {
    const currentUser = session?.user || user;
    const timestamp = new Date().toISOString();
    const resultEntries = Object.entries(results);
    
    if (resultEntries.length === 0) {
      return `🧪 LoFi Study API Test Report - No Results
============================================
Generated: ${timestamp}
User: ${currentUser?.email || 'Unknown'}
Status: No API tests have been run yet.

📋 Run some tests first, then use this button to copy all results!`;
    }

    const successCount = resultEntries.filter(([_, result]) => result.data.success).length;
    const failCount = resultEntries.length - successCount;

    let report = `🧪 LoFi Study API Test Report
============================================
Generated: ${timestamp}
User: ${currentUser?.email || 'Unknown'}
Total Tests: ${resultEntries.length}
✅ Successful: ${successCount}
❌ Failed: ${failCount}
Success Rate: ${Math.round((successCount / resultEntries.length) * 100)}%

🔐 User Context:
- Email: ${currentUser?.email || 'N/A'}
- ID: ${currentUser?.id || 'N/A'}
- Session Active: ${!!session ? 'Yes' : 'No'}

============================================
📋 INDIVIDUAL TEST RESULTS:
============================================

`;

    resultEntries.forEach(([endpoint, result], index) => {
      report += `${index + 1}. ${formatResultForCopy(endpoint, result)}\n\n`;
    });

    report += `
============================================
🏁 END OF REPORT
Generated by LoFi Study API Test Center
============================================`;

    return report;
  };

  if (!session) {
    return (
      <div className={styles.container}>
        <div className={styles.authRequired}>
          <h1>🔒 Authentication Required</h1>
          <p>Please sign in to test the APIs</p>
          <Link href="/auth/signin" className={styles.signInButton}>
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>🧪 LoFi Study API Test Center</h1>
        <p>Test all your application APIs in one place</p>
        <div className={styles.userInfo}>
          Logged in as: <strong>{session?.user?.email || user?.email}</strong>
        </div>
      </div>

      <div className={styles.testSections}>
        
        {/* Pomodoro APIs */}
        <div className={styles.section}>
          <h2>🍅 Pomodoro APIs</h2>
          
          <div className={styles.testGroup}>
            <h3>Get Pomodoro Sessions</h3>
            <button 
              onClick={() => apiCall('pomodoros')}
              disabled={loading.pomodoros}
              className={styles.testButton}
            >
              {loading.pomodoros ? 'Loading...' : 'GET /api/pomodoros'}
            </button>
          </div>

          <div className={styles.testGroup}>
            <h3>Create Pomodoro Session</h3>
            <div className={styles.inputGrid}>
              <input
                type="number"
                placeholder="Duration (minutes)"
                value={testData.pomodoro.duration}
                onChange={(e) => updateTestData('pomodoro', 'duration', parseInt(e.target.value))}
              />
              <select
                value={testData.pomodoro.type}
                onChange={(e) => updateTestData('pomodoro', 'type', e.target.value)}
              >
                <option value="work">Work</option>
                <option value="short_break">Short Break</option>
                <option value="long_break">Long Break</option>
              </select>
              <select
                value={testData.pomodoro.category}
                onChange={(e) => updateTestData('pomodoro', 'category', e.target.value)}
              >
                <option value="Studying">Studying</option>
                <option value="Coding">Coding</option>
                <option value="Writing">Writing</option>
                <option value="Working">Working</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Task Name"
                value={testData.pomodoro.task_name}
                onChange={(e) => updateTestData('pomodoro', 'task_name', e.target.value)}
              />
            </div>
            <button 
              onClick={() => apiCall('pomodoros', 'POST', {
                ...testData.pomodoro,
                completed_at: new Date().toISOString()
              })}
              disabled={loading['pomodoros-post']}
              className={styles.testButton}
            >
              {loading['pomodoros-post'] ? 'Creating...' : 'POST /api/pomodoros'}
            </button>
          </div>

          <div className={styles.testGroup}>
            <h3>Get Weekly Count</h3>
            <button 
              onClick={() => apiCall('pomodoros/weekly')}
              disabled={loading['pomodoros/weekly']}
              className={styles.testButton}
            >
              {loading['pomodoros/weekly'] ? 'Loading...' : 'GET /api/pomodoros/weekly'}
            </button>
          </div>

          <div className={styles.testGroup}>
            <h3>Update Pomodoro Count</h3>
            <div className={styles.inputGrid}>
              <input
                type="number"
                placeholder="Increment"
                value={testData.pomodoroCount.increment}
                onChange={(e) => updateTestData('pomodoroCount', 'increment', parseInt(e.target.value))}
              />
              <select
                value={testData.pomodoroCount.category}
                onChange={(e) => updateTestData('pomodoroCount', 'category', e.target.value)}
              >
                <option value="Studying">Studying</option>
                <option value="Coding">Coding</option>
                <option value="Writing">Writing</option>
                <option value="Working">Working</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button 
              onClick={() => apiCall('updatePomodoroCount', 'POST', testData.pomodoroCount)}
              disabled={loading.updatePomodoroCount}
              className={styles.testButton}
            >
              {loading.updatePomodoroCount ? 'Updating...' : 'POST /api/updatePomodoroCount'}
            </button>
          </div>

          <div className={styles.testGroup}>
            <h3>Get Pomodoro Stats</h3>
            <button 
              onClick={() => apiCall('getPomodoroStats', 'POST')}
              disabled={loading.getPomodoroStats}
              className={styles.testButton}
            >
              {loading.getPomodoroStats ? 'Loading...' : 'POST /api/getPomodoroStats'}
            </button>
          </div>
        </div>

        {/* Todo APIs */}
        <div className={styles.section}>
          <h2>✅ Todo APIs</h2>
          
          <div className={styles.testGroup}>
            <h3>Get Todos</h3>
            <button 
              onClick={() => apiCall('todos')}
              disabled={loading.todos}
              className={styles.testButton}
            >
              {loading.todos ? 'Loading...' : 'GET /api/todos'}
            </button>
          </div>

          <div className={styles.testGroup}>
            <h3>Create Todo</h3>
            <div className={styles.inputGrid}>
              <input
                type="text"
                placeholder="Todo text"
                value={testData.todo.text}
                onChange={(e) => updateTestData('todo', 'text', e.target.value)}
              />
              <input
                type="color"
                value={testData.todo.color}
                onChange={(e) => updateTestData('todo', 'color', e.target.value)}
              />
            </div>
            <button 
              onClick={() => apiCall('todos', 'POST', testData.todo)}
              disabled={loading['todos-post']}
              className={styles.testButton}
            >
              {loading['todos-post'] ? 'Creating...' : 'POST /api/todos'}
            </button>
          </div>

          <div className={styles.testGroup}>
            <h3>Get Todo Count</h3>
            <button 
              onClick={() => apiCall('todos/count')}
              disabled={loading['todos/count']}
              className={styles.testButton}
            >
              {loading['todos/count'] ? 'Loading...' : 'GET /api/todos/count'}
            </button>
          </div>
        </div>

        {/* Notes APIs */}
        <div className={styles.section}>
          <h2>📝 Notes APIs</h2>
          
          <div className={styles.testGroup}>
            <h3>Get Notes</h3>
            <button 
              onClick={() => apiCall('notes')}
              disabled={loading.notes}
              className={styles.testButton}
            >
              {loading.notes ? 'Loading...' : 'GET /api/notes'}
            </button>
          </div>

          <div className={styles.testGroup}>
            <h3>Create Note</h3>
            <div className={styles.inputGrid}>
              <input
                type="text"
                placeholder="Note title"
                value={testData.note.title}
                onChange={(e) => updateTestData('note', 'title', e.target.value)}
              />
              <textarea
                placeholder="Note content"
                value={testData.note.content}
                onChange={(e) => updateTestData('note', 'content', e.target.value)}
                rows={3}
              />
            </div>
            <button 
              onClick={() => apiCall('notes', 'POST', testData.note)}
              disabled={loading['notes-post']}
              className={styles.testButton}
            >
              {loading['notes-post'] ? 'Creating...' : 'POST /api/notes'}
            </button>
          </div>
        </div>

        {/* Calendar APIs */}
        <div className={styles.section}>
          <h2>📅 Calendar APIs</h2>
          
          <div className={styles.testGroup}>
            <h3>Get Events</h3>
            <button 
              onClick={() => apiCall('calendar')}
              disabled={loading.calendar}
              className={styles.testButton}
            >
              {loading.calendar ? 'Loading...' : 'GET /api/calendar'}
            </button>
          </div>

          <div className={styles.testGroup}>
            <h3>Create Event</h3>
            <div className={styles.inputGrid}>
              <input
                type="text"
                placeholder="Event title"
                value={testData.event.title}
                onChange={(e) => updateTestData('event', 'title', e.target.value)}
              />
              <input
                type="date"
                value={testData.event.date}
                onChange={(e) => updateTestData('event', 'date', e.target.value)}
              />
            </div>
            <button 
              onClick={() => apiCall('calendar', 'POST', testData.event)}
              disabled={loading['calendar-post']}
              className={styles.testButton}
            >
              {loading['calendar-post'] ? 'Creating...' : 'POST /api/calendar'}
            </button>
          </div>
        </div>

        {/* Other APIs */}
        <div className={styles.section}>
          <h2>🎯 Other APIs</h2>
          
          <div className={styles.testGroup}>
            <h3>System Info & Stats</h3>
            <button 
              onClick={() => apiCall('system-info')}
              disabled={loading['system-info']}
              className={styles.testButton}
            >
              {loading['system-info'] ? 'Loading...' : 'GET /api/system-info'}
            </button>
          </div>
          
          <div className={styles.testGroup}>
            <h3>Get Profile</h3>
            <button 
              onClick={() => apiCall('profile')}
              disabled={loading.profile}
              className={styles.testButton}
            >
              {loading.profile ? 'Loading...' : 'GET /api/profile'}
            </button>
          </div>

          <div className={styles.testGroup}>
            <h3>Get Scoreboard</h3>
            <button 
              onClick={() => apiCall('getScoreboard')}
              disabled={loading.getScoreboard}
              className={styles.testButton}
            >
              {loading.getScoreboard ? 'Loading...' : 'GET /api/getScoreboard'}
            </button>
          </div>

          <div className={styles.testGroup}>
            <h3>Get Challenges</h3>
            <button 
              onClick={() => apiCall('challenges')}
              disabled={loading.challenges}
              className={styles.testButton}
            >
              {loading.challenges ? 'Loading...' : 'GET /api/challenges'}
            </button>
          </div>

          <div className={styles.testGroup}>
            <h3>Create Challenge</h3>
            <div className={styles.inputGrid}>
              <input
                type="text"
                placeholder="Challenge title"
                value={testData.challenge.title}
                onChange={(e) => updateTestData('challenge', 'title', e.target.value)}
              />
              <textarea
                placeholder="Challenge description"
                value={testData.challenge.description}
                onChange={(e) => updateTestData('challenge', 'description', e.target.value)}
                rows={2}
              />
              <input
                type="number"
                placeholder="Points"
                value={testData.challenge.points}
                onChange={(e) => updateTestData('challenge', 'points', parseInt(e.target.value))}
              />
              <select
                value={testData.challenge.difficulty}
                onChange={(e) => updateTestData('challenge', 'difficulty', e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <button 
              onClick={() => apiCall('challenges', 'POST', testData.challenge)}
              disabled={loading['challenges-post']}
              className={styles.testButton}
            >
              {loading['challenges-post'] ? 'Creating...' : 'POST /api/challenges'}
            </button>
          </div>

          <div className={styles.testGroup}>
            <h3>Get Flashcard Count</h3>
            <button 
              onClick={() => apiCall('flashcards/count')}
              disabled={loading['flashcards/count']}
              className={styles.testButton}
            >
              {loading['flashcards/count'] ? 'Loading...' : 'GET /api/flashcards/count'}
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className={styles.resultsSection}>
        <h2>📊 Test Results</h2>
        {Object.keys(results).length === 0 ? (
          <p className={styles.noResults}>No tests run yet. Click any button above to test an API endpoint.</p>
        ) : (
          <div className={styles.results}>
            {Object.entries(results).map(([endpoint, result]) => (
              <div key={endpoint} className={`${styles.result} ${result.data.success ? styles.success : styles.error}`}>
                <div className={styles.resultHeader}>
                  <strong>{endpoint}</strong>
                  <span className={styles.timestamp}>{result.timestamp}</span>
                  <span className={`${styles.status} ${result.data.success ? styles.statusSuccess : styles.statusError}`}>
                    {result.data.status}
                  </span>
                  <div className={styles.buttonGroup}>
                    <button 
                      onClick={() => copyToClipboard(formatResultForCopy(endpoint, result))}
                      className={styles.copyButton}
                      title="Copy complete result for debugging"
                    >
                      📋 Copy All
                    </button>
                    <button 
                      onClick={() => copyToClipboard(JSON.stringify(result.data.data || result.data.error || result.data, null, 2))}
                      className={styles.copyButton}
                      title="Copy response data only"
                    >
                      📄 Copy Response
                    </button>
                    {result.data.requestBody && (
                      <button 
                        onClick={() => copyToClipboard(JSON.stringify(result.data.requestBody, null, 2))}
                        className={styles.copyButton}
                        title="Copy request body"
                      >
                        📨 Copy Request
                      </button>
                    )}
                  </div>
                </div>
                
                <div className={styles.resultDetails}>
                  <div className={styles.resultMeta}>
                    Method: {result.data.method || 'GET'} | Endpoint: {result.data.endpoint || `/api/${endpoint}`} | 
                    Success: {result.data.success ? '✅' : '❌'} | Status: {result.data.status}
                  </div>
                  
                  {result.data.requestBody && (
                    <div className={styles.requestBody}>
                      <div className={styles.debugTitle}>Request Body:</div>
                      <div className={styles.jsonData}>
                        {JSON.stringify(result.data.requestBody, null, 2)}
                      </div>
                    </div>
                  )}
                  
                  <div className={styles.responseData}>
                    <div className={styles.debugTitle}>Response Data:</div>
                    <div className={styles.jsonData}>
                      {JSON.stringify(result.data.data || result.data.error || result.data, null, 2)}
                    </div>
                  </div>

                  <div className={styles.debugSection}>
                    <div className={styles.debugTitle}>Console Output (Copy-Ready)</div>
                    <div className={styles.consoleOutput}>
{`🧪 API Test: ${endpoint}
Timestamp: ${result.timestamp}
Method: ${result.data.method || 'GET'}
Endpoint: ${result.data.endpoint || `/api/${endpoint}`}
Status: ${result.data.status}
Success: ${result.data.success}
${result.data.requestBody ? `Request Body: ${JSON.stringify(result.data.requestBody, null, 2)}` : ''}
Response: ${JSON.stringify(result.data.data || result.data.error || result.data, null, 2)}`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h2>⚡ Quick Actions</h2>
        
        <button 
          onClick={() => copyToClipboard(formatAllResultsForCopy())}
          className={styles.testAllButton}
          style={{ marginRight: '15px', marginBottom: '10px' }}
        >
          📋 Copy All Results
        </button>
        
        <button 
          onClick={() => {
            setResults({});
            setLoading({});
          }}
          className={styles.clearButton}
          style={{ marginRight: '15px', marginBottom: '10px' }}
        >
          🗑️ Clear All Results
        </button>
        
        <button 
          onClick={async () => {
            const endpoints = ['pomodoros', 'todos', 'notes', 'calendar', 'profile'];
            for (const endpoint of endpoints) {
              await apiCall(endpoint);
              await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between requests
            }
          }}
          className={styles.testAllButton}
          style={{ marginBottom: '10px' }}
        >
          🚀 Test All GET Endpoints
        </button>
      </div>
    </div>
  );
}
