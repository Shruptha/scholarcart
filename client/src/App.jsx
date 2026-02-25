/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import TaskList from './components/TaskList';
import TaskDetail from './components/TaskDetail';
import ProjectForm from './components/ProjectForm';
import TaskForm from './components/TaskForm';
import ExperimentList from './components/ExperimentList';
import ExperimentDetail from './components/ExperimentDetail';
import ExperimentForm from './components/ExperimentForm';

import ItemList from './components/ItemList';
import ItemDetail from './components/ItemDetail';
import ManualForm from './components/ManualForm';
import { Notifications, Settings } from './components/Settings';

const API = 'http://localhost:4000/api';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const [activeTab, setActiveTab] = useState('tasks');

  const [experiments, setExperiments] = useState([]);
  const [selectedExperimentId, setSelectedExperimentId] = useState(null);
  const [showExperimentForm, setShowExperimentForm] = useState(false);

  // New Scholar Cart states
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({});

  // ── Fetch projects ──
  const fetchProjects = useCallback(async () => {
    const res = await fetch(`${API}/projects`);
    const data = await res.json();
    setProjects(data);
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  // ── Fetch tasks when project changes ──
  const fetchTasks = useCallback(async () => {
    if (!selectedProjectId) { setTasks([]); return; }
    const res = await fetch(`${API}/projects/${selectedProjectId}/tasks`);
    const data = await res.json();
    setTasks(data);
  }, [selectedProjectId]);

  useEffect(() => {
    fetchTasks();
    setSelectedTaskId(null);
  }, [fetchTasks]);

  // ── Fetch experiments when project changes ──
  const fetchExperiments = useCallback(async () => {
    if (!selectedProjectId) { setExperiments([]); return; }
    const res = await fetch(`${API}/projects/${selectedProjectId}/experiments`);
    const data = await res.json();
    setExperiments(data);
  }, [selectedProjectId]);

  useEffect(() => {
    fetchExperiments();
    setSelectedExperimentId(null);
  }, [fetchExperiments]);

  // ── Fetch Global Items ──
  const fetchItems = useCallback(async () => {
    if (!['papers', 'jobs', 'conferences', 'signals'].includes(activeTab)) return;
    const res = await fetch(`${API}/${activeTab}`);
    const data = await res.json();
    setItems(data);
  }, [activeTab]);

  useEffect(() => {
    fetchItems();
    setSelectedItemId(null);
  }, [fetchItems]);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`${API}/notifications`);
      const data = await res.json();
      setNotifications(data);
    } catch (e) { }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch(`${API}/settings`);
      const data = await res.json();
      setSettings(data);
    } catch (e) { }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchSettings();
  }, [fetchNotifications, fetchSettings]);

  // ── Project CRUD ──
  const createProject = async (proj) => {
    await fetch(`${API}/projects`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(proj),
    });
    await fetchProjects();
  };

  const updateProject = async (id, proj) => {
    await fetch(`${API}/projects/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(proj),
    });
    await fetchProjects();
  };

  const deleteProject = async (id) => {
    await fetch(`${API}/projects/${id}`, { method: 'DELETE' });
    if (selectedProjectId === id) { setSelectedProjectId(null); setTasks([]); setSelectedTaskId(null); setExperiments([]); setSelectedExperimentId(null); }
    await fetchProjects();
  };

  // ── Task CRUD ──
  const createTask = async (task) => {
    await fetch(`${API}/tasks`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...task, project_id: selectedProjectId }),
    });
    await fetchTasks();
    await fetchProjects();
  };

  const updateTask = async (id, updates) => {
    await fetch(`${API}/tasks/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates),
    });
    await fetchTasks();
    await fetchProjects();
  };

  const deleteTask = async (id) => {
    await fetch(`${API}/tasks/${id}`, { method: 'DELETE' });
    if (selectedTaskId === id) setSelectedTaskId(null);
    await fetchTasks();
    await fetchProjects();
  };

  // ── Experiment CRUD ──
  const createExperiment = async (exp) => {
    const payload = { ...exp, project_id: selectedProjectId };
    await fetch(`${API}/experiments`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    await fetchExperiments();
  };

  const updateExperiment = async (id, updates) => {
    await fetch(`${API}/experiments/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates),
    });
    await fetchExperiments();
  };

  const deleteExperiment = async (id) => {
    await fetch(`${API}/experiments/${id}`, { method: 'DELETE' });
    if (selectedExperimentId === id) setSelectedExperimentId(null);
    await fetchExperiments();
  };

  // ── Global Item Actions ──
  const handleItemAction = async (id, action) => {
    await fetch(`${API}/items/${id}/${action}`, { method: 'POST' });
    await fetchItems();
  };

  const handleRefresh = async () => {
    await fetch(`${API}/refresh`, { method: 'POST' });
    if (['papers', 'jobs', 'conferences', 'signals'].includes(activeTab)) {
      await fetchItems();
    }
  };

  const handleManualSave = async (data) => {
    await fetch(`${API}/${activeTab}/manual`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    setShowManualForm(false);
    await fetchItems();
    await fetchNotifications();
  };

  const handleSaveSettings = async (data) => {
    await fetch(`${API}/settings`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    await fetchSettings();
  };

  const handleDismissNotification = async (id) => {
    await fetch(`${API}/notifications/${id}/dismiss`, { method: 'POST' });
    await fetchNotifications();
  };

  // ── Derived ──
  const selectedProject = projects.find((p) => p.id === selectedProjectId) || null;
  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || null;
  const filteredTasks = statusFilter === 'all' ? tasks : tasks.filter((t) => t.status === statusFilter);
  const selectedExperiment = experiments.find((e) => e.id === selectedExperimentId) || null;
  const selectedItem = items.find((i) => i.id === selectedItemId) || null;

  // ── Handle tab switch ──
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'tasks') setSelectedExperimentId(null);
    if (tab === 'experiments') setSelectedTaskId(null);
    if (['papers', 'jobs', 'conferences', 'signals'].includes(tab)) setSelectedItemId(null);
  };

  return (
    <div className="app">
      {/* Col 1 */}
      <Sidebar
        projects={projects}
        selectedId={selectedProjectId}
        onSelect={setSelectedProjectId}
        onNew={() => { setEditingProject(null); setShowProjectForm(true); }}
        onEdit={(p) => { setEditingProject(p); setShowProjectForm(true); }}
        onDelete={deleteProject}
      />

      {/* Col 2 */}
      <section className="task-list">
        <div className="task-list__header">
          <div className="tab-bar" style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '10px' }}>
            <button className={`tab-bar__tab ${activeTab === 'tasks' ? 'tab-bar__tab--active' : ''}`} onClick={() => handleTabChange('tasks')}>📋 Tasks</button>
            <button className={`tab-bar__tab ${activeTab === 'experiments' ? 'tab-bar__tab--active' : ''}`} onClick={() => handleTabChange('experiments')}>🧪 Experiments</button>
            <button className={`tab-bar__tab ${activeTab === 'papers' ? 'tab-bar__tab--active' : ''}`} onClick={() => handleTabChange('papers')}>📄 Papers</button>
            <button className={`tab-bar__tab ${activeTab === 'jobs' ? 'tab-bar__tab--active' : ''}`} onClick={() => handleTabChange('jobs')}>💼 Jobs</button>
            <button className={`tab-bar__tab ${activeTab === 'conferences' ? 'tab-bar__tab--active' : ''}`} onClick={() => handleTabChange('conferences')}>🎙 Conferences</button>
            <button className={`tab-bar__tab ${activeTab === 'signals' ? 'tab-bar__tab--active' : ''}`} onClick={() => handleTabChange('signals')}>📡 Signals</button>
            <button className={`tab-bar__tab ${activeTab === 'notifications' ? 'tab-bar__tab--active' : ''}`} onClick={() => handleTabChange('notifications')}>🔔 Alerts {notifications.length > 0 && `(${notifications.length})`}</button>
            <button className={`tab-bar__tab ${activeTab === 'settings' ? 'tab-bar__tab--active' : ''}`} onClick={() => handleTabChange('settings')}>⚙️ Settings</button>
          </div>
          <div className="task-list__header-actions">
            {activeTab === 'tasks' && selectedProject && (
              <>
                <select className="task-list__filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">All</option>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <button className="task-list__add-btn" onClick={() => setShowTaskForm(true)}>＋ Task</button>
              </>
            )}
            {activeTab === 'experiments' && selectedProject && (
              <button className="task-list__add-btn" onClick={() => setShowExperimentForm(true)}>＋ Experiment</button>
            )}
          </div>
        </div>

        {activeTab === 'tasks' ? (
          selectedProject ? (
            <TaskList
              project={selectedProject}
              tasks={filteredTasks}
              selectedTaskId={selectedTaskId}
              onSelectTask={setSelectedTaskId}
              onNewTask={() => setShowTaskForm(true)}
              statusFilter={statusFilter}
              onFilterChange={setStatusFilter}
            />
          ) : <div className="no-project"><div className="no-project__icon">📂</div><div>Select or create a project to see tasks</div></div>
        ) : activeTab === 'experiments' ? (
          selectedProject ? (
            <ExperimentList
              project={selectedProject}
              experiments={experiments}
              selectedExperimentId={selectedExperimentId}
              onSelectExperiment={setSelectedExperimentId}
              onNewExperiment={() => setShowExperimentForm(true)}
            />
          ) : <div className="no-project"><div className="no-project__icon">📂</div><div>Select or create a project to see experiments</div></div>
        ) : ['papers', 'jobs', 'conferences', 'signals'].includes(activeTab) ? (
          <ItemList
            type={activeTab}
            items={items}
            selectedItemId={selectedItemId}
            onSelectItem={setSelectedItemId}
            onRefresh={handleRefresh}
            onNewManual={() => setShowManualForm(true)}
          />
        ) : activeTab === 'notifications' ? (
          <Notifications notifications={notifications} onDismiss={handleDismissNotification} />
        ) : activeTab === 'settings' ? (
          <Settings settings={settings} onSave={handleSaveSettings} />
        ) : null}
      </section>

      {/* Col 3 */}
      {activeTab === 'tasks' && selectedProject && (
        <TaskDetail
          task={selectedTask}
          onUpdate={(updates) => updateTask(selectedTask.id, updates)}
          onDelete={() => deleteTask(selectedTask.id)}
        />
      )}

      {activeTab === 'experiments' && selectedProject && (
        <ExperimentDetail
          experiment={selectedExperiment}
          onUpdate={(updates) => updateExperiment(selectedExperiment.id, updates)}
          onDelete={() => deleteExperiment(selectedExperiment.id)}
        />
      )}

      {['papers', 'jobs', 'conferences', 'signals'].includes(activeTab) && (
        <ItemDetail item={selectedItem} onAction={handleItemAction} />
      )}

      {/* Modals */}
      {showProjectForm && (
        <ProjectForm
          project={editingProject}
          onSave={async (data) => {
            if (editingProject) await updateProject(editingProject.id, data);
            else await createProject(data);
            setShowProjectForm(false);
          }}
          onClose={() => setShowProjectForm(false)}
        />
      )}

      {showTaskForm && (
        <TaskForm
          onSave={async (data) => { await createTask(data); setShowTaskForm(false); }}
          onClose={() => setShowTaskForm(false)}
        />
      )}

      {showExperimentForm && (
        <ExperimentForm
          onSave={async (data) => { await createExperiment(data); setShowExperimentForm(false); }}
          onClose={() => setShowExperimentForm(false)}
        />
      )}

      {showManualForm && (
        <ManualForm
          type={activeTab}
          onSave={handleManualSave}
          onClose={() => setShowManualForm(false)}
        />
      )}
    </div>
  );
}
