document.addEventListener('DOMContentLoaded', () => {
    // --- DATA PERSISTENCE ---
    const STORAGE_KEY = 'optimized-scheduler-tasks';
    
    // Default tasks (fallback if no saved data)
    const defaultTasks = [
        // Psychology 101
        { id: 1, category: 'Psychology 101', name: 'Grading Quiz 2', completed: false, dueDate: null, timeToComplete: 60, tags: ['work', 'deep focus', 'computer'] },
        { id: 2, category: 'Psychology 101', name: 'Prepare Lecture', completed: false, dueDate: null, timeToComplete: 90, tags: ['work', 'creative', 'computer'] },
        { id: 3, category: 'Psychology 101', name: 'Prepare Midterm', completed: false, dueDate: null, timeToComplete: 120, tags: ['work', 'deep focus', 'computer'] },
        { id: 4, category: 'Psychology 101', name: 'Gradebook', completed: false, dueDate: null, timeToComplete: 30, tags: ['work', 'computer'] },
        // Neuroscience 201
        { id: 5, category: 'Neuroscience 201', name: 'Grade Assignment 1', completed: false, dueDate: null, timeToComplete: 120, tags: ['work', 'deep focus', 'computer'] },
        { id: 6, category: 'Neuroscience 201', name: 'Fix Project Files', completed: false, dueDate: null, timeToComplete: 45, tags: ['work', 'computer'] },
        { id: 7, category: 'Neuroscience 201', name: 'Lecture', completed: false, dueDate: null, timeToComplete: 60, tags: ['work', 'creative', 'computer'] },
        { id: 8, category: 'Neuroscience 201', name: 'Assignment 2', completed: false, dueDate: null, timeToComplete: 90, tags: ['work', 'deep focus', 'computer'] },
        // Research Project
        { id: 9, category: 'Research Project', name: 'Meet Collaborator', completed: false, dueDate: null, timeToComplete: 60, tags: ['social', 'planning'] },
        { id: 10, category: 'Research Project', name: 'Develop App', completed: false, dueDate: null, timeToComplete: 180, tags: ['work', 'deep focus', 'computer', 'creative'] },
        { id: 11, category: 'Research Project', name: 'Equipment List', completed: false, dueDate: null, timeToComplete: 45, tags: ['work', 'research', 'computer'] },
        // Sports Team
        { id: 12, category: 'Sports Team', name: 'Coach Forms', completed: false, dueDate: null, timeToComplete: 30, tags: ['admin'] },
        { id: 13, category: 'Sports Team', name: 'Collect Fees', completed: false, dueDate: null, timeToComplete: 20, tags: ['admin'] },
        { id: 14, category: 'Sports Team', name: 'Practice Saturday', completed: false, dueDate: null, timeToComplete: 120, tags: ['sport', 'social'] },
        { id: 15, category: 'Sports Team', name: 'Scrimmage Wednesday', completed: false, dueDate: null, timeToComplete: 120, tags: ['sport', 'social'] },
        // Consulting
        { id: 16, category: 'Consulting', name: '1 hr Prep', completed: true, dueDate: null, timeToComplete: 60, tags: ['work', 'planning', 'computer'] },
        { id: 17, category: 'Consulting', name: 'Client Meeting 2:00pm', completed: false, dueDate: null, timeToComplete: 90, tags: ['work', 'social'] },
        // House
        { id: 18, category: 'House', name: 'Child\'s Bedroom', completed: false, dueDate: null, timeToComplete: 45, tags: ['chore', 'home'] },
        { id: 19, category: 'House', name: 'Clean Garage', completed: false, dueDate: null, timeToComplete: 120, tags: ['chore', 'home', 'physical'] },
        { id: 20, category: 'House', name: 'Living Room Lights', completed: false, dueDate: null, timeToComplete: 30, tags: ['chore', 'home'] },
        // Office
        { id: 21, category: 'Office', name: 'Clean', completed: false, dueDate: null, timeToComplete: 30, tags: ['chore', 'office'] },
        { id: 22, category: 'Office', name: 'Computer Setup', completed: false, dueDate: null, timeToComplete: 20, tags: ['chore', 'office', 'computer'] },
        { id: 23, category: 'Office', name: 'Air Flow', completed: false, dueDate: null, timeToComplete: 15, tags: ['chore', 'office'] },
        // Grant
        { id: 24, category: 'Grant', name: 'Draft Proposal', completed: false, dueDate: '2025-10-16', timeToComplete: 240, tags: ['work', 'deep focus', 'writing', 'computer'] },
    ];

    // Load tasks from localStorage or use defaults
    let tasks = loadTasks();

    // Save tasks to localStorage
    function saveTasks() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
            console.log('Tasks saved successfully');
        } catch (error) {
            console.error('Failed to save tasks:', error);
        }
    }

    // Load tasks from localStorage
    function loadTasks() {
        try {
            const savedTasks = localStorage.getItem(STORAGE_KEY);
            if (savedTasks) {
                return JSON.parse(savedTasks);
            }
        } catch (error) {
            console.error('Failed to load tasks:', error);
        }
        return [...defaultTasks]; // Return a copy of default tasks
    }

    // Export tasks to JSON file
    function exportTasks() {
        const dataStr = JSON.stringify(tasks, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `task-scheduler-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    // Import tasks from JSON file
    function importTasks(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedTasks = JSON.parse(e.target.result);
                if (Array.isArray(importedTasks) && importedTasks.length > 0) {
                    tasks = importedTasks;
                    saveTasks();
                    renderTasks();
                    alert('Tasks imported successfully!');
                } else {
                    alert('Invalid task file format');
                }
            } catch (error) {
                alert('Failed to import tasks: ' + error.message);
            }
        };
        reader.readAsText(file);
        
        // Reset file input
        event.target.value = '';
    }

    // --- DOM Elements ---
    const tasksContainer = document.getElementById('tasks-container');
    const getTaskBtn = document.getElementById('get-task-btn');
    const availableTimeInput = document.getElementById('available-time');
    const timeOfDaySelect = document.getElementById('time-of-day');
    const moodSelect = document.getElementById('mood');
    const taskSuggestionCard = document.getElementById('task-suggestion-card');

    // --- LOGIC ---

    const renderTasks = () => {
        tasksContainer.innerHTML = '';
        const categories = [...new Set(tasks.map(task => task.category))];

        categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('task-category');
            categoryDiv.setAttribute('data-category', category);

            const categoryTitle = document.createElement('h3');
            categoryTitle.textContent = category;
            categoryDiv.appendChild(categoryTitle);

            const categoryContent = document.createElement('div');
            categoryContent.classList.add('task-category-content');

            tasks.filter(task => task.category === category).forEach((task, index) => {
                const taskItem = document.createElement('div');
                taskItem.classList.add('task-item');
                taskItem.setAttribute('data-task-id', task.id);
                taskItem.setAttribute('draggable', 'true');
                if (task.completed) {
                    taskItem.classList.add('completed');
                }

                // Create pills for tags
                let pillsHTML = '';
                if (task.tags && task.tags.length > 0) {
                    // Limit to first 2 tags for compact display
                    const displayTags = task.tags.slice(0, 2);
                    pillsHTML = displayTags.map(tag => {
                        const pillClass = tag.replace(/\s+/g, '-').toLowerCase();
                        return `<span class="pill ${pillClass}">${tag}</span>`;
                    }).join('');
                }

                // Due date pill (show first)
                let duePillHTML = '';
                let dateDisplay = '';
                if (task.dueDate) {
                    // Use the date string directly to avoid timezone issues
                    const dateStr = task.dueDate;
                    const dueDate = new Date(dateStr + 'T00:00:00'); // Add time to avoid timezone conversion
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // Reset time for accurate comparison
                    
                    const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                    
                    // Format date nicely
                    const options = { month: 'short', day: 'numeric' };
                    const formattedDate = dueDate.toLocaleDateString('en-US', options);
                    
                    if (daysUntilDue < 0) {
                        duePillHTML = `<span class="pill overdue">OVERDUE</span>`;
                    } else if (daysUntilDue <= 7) {
                        duePillHTML = `<span class="pill due-soon">${daysUntilDue}d</span>`;
                    }
                    
                    // Always show date
                    dateDisplay = `
                        <div class="date-indicator">
                            <span class="date-pill">📅 ${formattedDate}</span>
                        </div>
                    `;
                }

                // Time circle indicator
                let timeIndicatorHTML = '';
                if (task.timeToComplete) {
                    const minutes = task.timeToComplete;
                    const hours = Math.floor(minutes / 60);
                    const remainingMinutes = minutes % 60;
                    
                    // Calculate ring percentages (each ring = 60 minutes = 100%)
                    let innerPercentage = 0;
                    let outerPercentage = 0;
                    let showOuter = 0;
                    
                    if (minutes <= 60) {
                        // First hour: fill inner ring
                        innerPercentage = (minutes / 60) * 100;
                    } else {
                        // More than 1 hour: fill inner ring completely, start outer ring
                        innerPercentage = 100;
                        outerPercentage = (remainingMinutes / 60) * 100;
                        showOuter = 1;
                    }
                    
                    const displayTime = hours > 0 
                        ? (remainingMinutes > 0 ? `${hours}h${remainingMinutes}m` : `${hours}h`)
                        : `${minutes}m`;
                    
                    timeIndicatorHTML = `
                        <div class="time-indicator">
                            <div class="time-circle" style="--inner-percentage: ${innerPercentage}; --outer-percentage: ${outerPercentage}; --show-outer: ${showOuter}">
                                <div class="time-circle-center"></div>
                                <span class="time-circle-text">${displayTime}</span>
                            </div>
                        </div>
                    `;
                }

                taskItem.innerHTML = `
                    <div class="task-item-row">
                        <span class="drag-handle">⋮⋮</span>
                        <div class="task-item-details">
                            <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
                            <label for="task-${task.id}">${task.name}</label>
                        </div>
                        ${dateDisplay}
                        ${timeIndicatorHTML}
                        <div class="task-pills">
                            ${duePillHTML}
                            ${pillsHTML}
                        </div>
                        <button class="edit-button" title="Edit task">✏️</button>
                    </div>
                    <div class="edit-controls">
                        <div class="edit-fields">
                            <div class="edit-field">
                                <label>Task Name</label>
                                <input type="text" class="edit-name" value="${task.name}">
                            </div>
                            <div class="edit-field">
                                <label>Due Date</label>
                                <input type="date" class="edit-date" value="${task.dueDate || ''}">
                            </div>
                            <div class="edit-field">
                                <label>Minutes</label>
                                <input type="number" class="edit-time" value="${task.timeToComplete || ''}" min="0" step="5">
                            </div>
                        </div>
                        <div class="edit-buttons">
                            <button class="cancel-edit">Cancel</button>
                            <button class="save-edit">Save Changes</button>
                        </div>
                    </div>
                `;
                
                const checkbox = taskItem.querySelector(`input[type="checkbox"]`);
                checkbox.addEventListener('change', () => {
                    task.completed = checkbox.checked;
                    saveTasks(); // Save after completion change
                    renderTasks();
                });

                // Add listeners for date and time inputs
                const dateInput = taskItem.querySelector('input[type="date"]');
                const timeInput = taskItem.querySelector('input[type="number"]');
                
                dateInput.addEventListener('change', (e) => {
                    task.dueDate = e.target.value || null;
                    saveTasks(); // Save after date change
                    renderTasks();
                });
                
                timeInput.addEventListener('change', (e) => {
                    task.timeToComplete = parseInt(e.target.value, 10) || null;
                    saveTasks(); // Save after time change
                    renderTasks();
                });

                // Edit button functionality
                const editBtn = taskItem.querySelector('.edit-button');
                const cancelBtn = taskItem.querySelector('.cancel-edit');
                const saveBtn = taskItem.querySelector('.save-edit');
                
                editBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    taskItem.classList.add('editing');
                    taskItem.setAttribute('draggable', 'false');
                });
                
                cancelBtn.addEventListener('click', () => {
                    taskItem.classList.remove('editing');
                    taskItem.setAttribute('draggable', 'true');
                });
                
                saveBtn.addEventListener('click', () => {
                    const newName = taskItem.querySelector('.edit-name').value.trim();
                    const newDate = taskItem.querySelector('.edit-date').value;
                    const newTime = parseInt(taskItem.querySelector('.edit-time').value, 10);
                    
                    if (newName) {
                        task.name = newName;
                        task.dueDate = newDate || null;
                        task.timeToComplete = isNaN(newTime) ? null : newTime;
                        
                        taskItem.classList.remove('editing');
                        taskItem.setAttribute('draggable', 'true');
                        saveTasks(); // Save after edit
                        renderTasks();
                    }
                });

                // Drag and drop event listeners
                taskItem.addEventListener('dragstart', handleDragStart);
                taskItem.addEventListener('dragend', handleDragEnd);
                taskItem.addEventListener('dragover', handleDragOver);
                taskItem.addEventListener('drop', handleDrop);
                taskItem.addEventListener('dragenter', handleDragEnter);
                taskItem.addEventListener('dragleave', handleDragLeave);

                categoryContent.appendChild(taskItem);
            });

            // Add "Add Task" button and form
            const addTaskBtn = document.createElement('button');
            addTaskBtn.classList.add('add-task-btn');
            addTaskBtn.textContent = '+ Add Task';
            addTaskBtn.addEventListener('click', () => {
                const form = categoryContent.querySelector('.add-task-form');
                form.classList.toggle('active');
                if (form.classList.contains('active')) {
                    form.querySelector('input[type="text"]').focus();
                }
            });

            const addTaskForm = document.createElement('div');
            addTaskForm.classList.add('add-task-form');
            addTaskForm.innerHTML = `
                <input type="text" placeholder="Task name" class="task-name-input">
                <div class="add-task-form-row">
                    <input type="date" placeholder="Due Date" class="task-date-input">
                    <input type="number" placeholder="Minutes" class="task-time-input" min="0" step="5">
                </div>
                <div class="add-task-form-buttons">
                    <button class="cancel-btn">Cancel</button>
                    <button class="save-btn">Save Task</button>
                </div>
            `;

            const saveBtn = addTaskForm.querySelector('.save-btn');
            const cancelBtn = addTaskForm.querySelector('.cancel-btn');

            saveBtn.addEventListener('click', () => {
                const taskName = addTaskForm.querySelector('.task-name-input').value.trim();
                const taskDate = addTaskForm.querySelector('.task-date-input').value;
                const taskTime = addTaskForm.querySelector('.task-time-input').value;

                if (taskName) {
                    // Create new task
                    const newTask = {
                        id: Math.max(...tasks.map(t => t.id), 0) + 1,
                        category: category,
                        name: taskName,
                        completed: false,
                        dueDate: taskDate || null,
                        timeToComplete: taskTime ? parseInt(taskTime, 10) : null,
                        tags: []
                    };

                    // Add to tasks array at the position after other tasks in this category
                    const categoryTasks = tasks.filter(t => t.category === category);
                    const lastCategoryTaskIndex = categoryTasks.length > 0 
                        ? tasks.indexOf(categoryTasks[categoryTasks.length - 1]) + 1
                        : tasks.length;
                    
                    tasks.splice(lastCategoryTaskIndex, 0, newTask);

                    // Clear form and hide
                    addTaskForm.querySelector('.task-name-input').value = '';
                    addTaskForm.querySelector('.task-date-input').value = '';
                    addTaskForm.querySelector('.task-time-input').value = '';
                    addTaskForm.classList.remove('active');

                    // Save and re-render
                    saveTasks(); // Save after adding new task
                    renderTasks();
                }
            });

            cancelBtn.addEventListener('click', () => {
                addTaskForm.querySelector('.task-name-input').value = '';
                addTaskForm.querySelector('.task-date-input').value = '';
                addTaskForm.querySelector('.task-time-input').value = '';
                addTaskForm.classList.remove('active');
            });

            // Allow Enter key to save
            addTaskForm.querySelector('.task-name-input').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    saveBtn.click();
                }
            });

            categoryContent.appendChild(addTaskBtn);
            categoryContent.appendChild(addTaskForm);
            categoryDiv.appendChild(categoryContent);
            tasksContainer.appendChild(categoryDiv);
        });
        
        // Re-render timeline after tasks update
        renderTimeline();
    };
    
    const getSuggestedTask = () => {
        const availableTime = parseInt(availableTimeInput.value, 10);
        const mood = moodSelect.value;
        
        if (isNaN(availableTime) || availableTime <= 0) {
            taskSuggestionCard.innerHTML = `<p>Please enter a valid amount of time.</p>`;
            return;
        }

        let possibleTasks = tasks.filter(task => !task.completed && task.timeToComplete <= availableTime);
        
        let scoredTasks = possibleTasks.map(task => {
            let score = 0;
            
            // Prioritize tasks with due dates
            if (task.dueDate) {
                const dueDate = new Date(task.dueDate);
                const today = new Date();
                const daysUntilDue = (dueDate - today) / (1000 * 60 * 60 * 24);
                if (daysUntilDue < 0) score += 1000; // Overdue
                else if (daysUntilDue < 2) score += 50;
                else if (daysUntilDue < 7) score += 20;
            }

            // Match mood
            if (mood === 'high-energy' && (task.tags.includes('deep focus') || task.tags.includes('work'))) score += 30;
            if (mood === 'low-energy' && (task.tags.includes('chore') || task.tags.includes('admin'))) score += 30;
            if (mood === 'creative' && task.tags.includes('creative')) score += 40;

            // Bonus for tasks that fit the time well
            if (task.timeToComplete > availableTime * 0.75) {
                score += 15;
            }

            return { ...task, score };
        });

        scoredTasks.sort((a, b) => b.score - a.score);

        if (scoredTasks.length > 0) {
            const bestTask = scoredTasks[0];
            
            // Create pills for the suggested task
            let pillsHTML = '';
            if (bestTask.tags && bestTask.tags.length > 0) {
                pillsHTML = bestTask.tags.map(tag => {
                    const pillClass = tag.replace(/\s+/g, '-').toLowerCase();
                    return `<span class="pill ${pillClass}">${tag}</span>`;
                }).join('');
            }
            
            // Add time indicator for suggested task (keep as pill for suggestion card)
            const displayTime = bestTask.timeToComplete >= 60 
                ? `${Math.floor(bestTask.timeToComplete / 60)}h ${bestTask.timeToComplete % 60}m` 
                : `${bestTask.timeToComplete}m`;
            
            pillsHTML += `<span class="pill time">⏱ ${displayTime}</span>`;
            
            taskSuggestionCard.innerHTML = `
                <h4>✨ ${bestTask.name}</h4>
                <p><strong>Category:</strong> ${bestTask.category}</p>
                ${bestTask.dueDate ? `<p><strong>Due:</strong> ${bestTask.dueDate}</p>` : ''}
                <div class="task-pills">${pillsHTML}</div>
            `;
        } else {
            taskSuggestionCard.innerHTML = `<p>No suitable tasks found for the given time. Maybe break a larger task into smaller parts?</p>`;
        }
    };

    // --- DRAG AND DROP FUNCTIONALITY ---
    let draggedElement = null;
    let draggedTaskId = null;

    function handleDragStart(e) {
        draggedElement = this;
        draggedTaskId = parseInt(this.getAttribute('data-task-id'));
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    }

    function handleDragEnd(e) {
        this.classList.remove('dragging');
        document.querySelectorAll('.task-item').forEach(item => {
            item.classList.remove('drag-over');
        });
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    function handleDragEnter(e) {
        if (this !== draggedElement) {
            this.classList.add('drag-over');
        }
    }

    function handleDragLeave(e) {
        this.classList.remove('drag-over');
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        if (draggedElement !== this) {
            const draggedTask = tasks.find(t => t.id === draggedTaskId);
            const targetTaskId = parseInt(this.getAttribute('data-task-id'));
            const targetTask = tasks.find(t => t.id === targetTaskId);

            if (draggedTask && targetTask && draggedTask.category === targetTask.category) {
                // Reorder tasks within the same category
                const draggedIndex = tasks.indexOf(draggedTask);
                const targetIndex = tasks.indexOf(targetTask);

                tasks.splice(draggedIndex, 1);
                const newTargetIndex = tasks.indexOf(targetTask);
                tasks.splice(newTargetIndex, 0, draggedTask);

                saveTasks(); // Save after reorder
                renderTasks();
            }
        }

        return false;
    }

    // --- TIMELINE FUNCTIONALITY ---
    let timelineZoom = 1; // Default zoom level (0.5 to 3.0)
    const minZoom = 0.5;
    const maxZoom = 3.0;
    const zoomStep = 0.1;
    let timelinePanX = 0;
    let timelinePanY = 0;
    let isPanning = false;
    let panStartX = 0;
    let panStartY = 0;
    
    function applyTimelineTransform() {
        const timelineTrack = document.getElementById('timeline-track');
        if (!timelineTrack) return;
        
        timelineTrack.style.transform = `scale(${timelineZoom}) translate(${timelinePanX}px, ${timelinePanY}px)`;
    }
    
    // Calculate Y position on wave for a given day offset from start
    function getWaveY(dayOffset, totalDays, centerY = 234, weeklyAmplitude = 40, dailyAmplitude = 15) {
        // Weekly cycle (slower wave)
        const weeklyFreq = (2 * Math.PI) / 7; // One full cycle per week
        const weeklyWave = Math.sin(dayOffset * weeklyFreq) * weeklyAmplitude;
        
        // Daily cycle (7 cycles per week) - modulates the weekly wave
        const dailyFreq = (2 * Math.PI); // One full cycle per day
        const dailyWave = Math.sin(dayOffset * dailyFreq) * dailyAmplitude;
        
        return centerY + weeklyWave + dailyWave;
    }
    
    // Get the CSS-defined top position for a given level
    function getLevelTop(level) {
        // Upper levels: further above the wave (wave ranges ~179-289px, center 234px)
        // Lower levels: further below the wave
        const levelTops = [20, 50, 80, 110, 140, 320, 350, 380, 410, 440, 470, 500, 530, 560, 590];
        return levelTops[Math.min(level, levelTops.length - 1)];
    }
    
    // Generate SVG path for the wave
    function generateWavePath(timeSpan, startDate, containerRect) {
        const containerWidth = containerRect.width;
        const steps = Math.max(timeSpan * 10, 100); // More steps for smoother curve
        const leftPadding = 16; // 1rem in pixels
        const rightPadding = 16;
        const usableWidth = containerWidth - leftPadding - rightPadding;
        
        let pathData = '';
        
        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;
            const dayOffset = progress * timeSpan;
            const x = leftPadding + (progress * usableWidth);
            const y = getWaveY(dayOffset, timeSpan);
            
            if (i === 0) {
                pathData += `M ${x} ${y}`;
            } else {
                pathData += ` L ${x} ${y}`;
            }
        }
        
        return pathData;
    }
    
    function renderTimeline() {
        const timelineTrack = document.getElementById('timeline-track');
        if (!timelineTrack) return;
        
        // Get tasks with due dates
        const tasksWithDates = tasks.filter(task => task.dueDate && !task.completed);
        if (tasksWithDates.length === 0) {
            timelineTrack.innerHTML = '<div style="text-align: center; color: #666; padding: 2rem;">No upcoming due dates</div>';
            return;
        }
        
        // Sort by due date
        tasksWithDates.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time for accurate comparison
        const earliestDate = new Date(tasksWithDates[0].dueDate + 'T00:00:00');
        const latestDate = new Date(tasksWithDates[tasksWithDates.length - 1].dueDate + 'T00:00:00');
        
        // Calculate timeline span in days - ensure today is included and past dates are shown
        const timeSpan = Math.max(7, (latestDate - earliestDate) / (1000 * 60 * 60 * 24) + 4);
        // Start date should be earlier of: earliest task date minus 1 day, or today minus 3 days
        const earliestStart = new Date(earliestDate.getTime() - 86400000); // 1 day before earliest task
        const todayMinus3 = new Date(today.getTime() - (3 * 86400000)); // 3 days before today
        const startDate = new Date(Math.min(earliestStart.getTime(), todayMinus3.getTime()));
        
        // Clear timeline
        timelineTrack.innerHTML = '';
        
        // Create SVG for wave timeline
        const containerRect = timelineTrack.getBoundingClientRect();
        const containerWidth = containerRect.width || 1200; // Fallback width
        const containerHeight = containerRect.height || 650; // Fallback height
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'timeline-wave-svg');
        svg.setAttribute('viewBox', `0 0 ${containerWidth} ${containerHeight}`);
        svg.setAttribute('width', containerWidth);
        svg.setAttribute('height', containerHeight);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        
        // Create gradient definition
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'timeline-gradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('x2', '100%');
        
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#0a84ff');
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '50%');
        stop2.setAttribute('stop-color', '#bf5af2');
        
        const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop3.setAttribute('offset', '100%');
        stop3.setAttribute('stop-color', '#ff375f');
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        gradient.appendChild(stop3);
        defs.appendChild(gradient);
        svg.appendChild(defs);
        
        // Generate wave path
        const wavePath = generateWavePath(timeSpan, startDate, { width: containerWidth, height: containerHeight });
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('class', 'timeline-wave-path');
        path.setAttribute('d', wavePath);
        svg.appendChild(path);
        
        timelineTrack.appendChild(svg);
        
        // Add today indicator line - positioned on the wave
        const todayDaysFromStart = (today - startDate) / (1000 * 60 * 60 * 24);
        const todayPosition = ((todayDaysFromStart / timeSpan) * 100);
        
        console.log('Today position debug:', {
            today: today.toDateString(),
            startDate: startDate.toDateString(),
            todayDaysFromStart,
            timeSpan,
            todayPosition: todayPosition + '%'
        });
        
        if (todayPosition >= -5 && todayPosition <= 105) { // Allow slightly outside bounds
            const todayWaveY = getWaveY(todayDaysFromStart, timeSpan);
            
            const todayLine = document.createElement('div');
            todayLine.className = 'timeline-today-line';
            // Match the positioning calculation used for tasks
            todayLine.style.left = `${Math.max(1, Math.min(99, todayPosition))}%`;
            todayLine.style.top = `${todayWaveY}px`;
            todayLine.style.height = '100px'; // Extends vertically from wave
            timelineTrack.appendChild(todayLine);
            
            // Add past overlay
            const pastOverlay = document.createElement('div');
            pastOverlay.className = 'timeline-past-overlay';
            pastOverlay.style.width = `${Math.max(0, Math.min(100, todayPosition))}%`;
            timelineTrack.appendChild(pastOverlay);
        }
        
        // Apply zoom and pan transform
        applyTimelineTransform();
        
        // Calculate positions and detect overlaps
        const markerData = tasksWithDates.map(task => {
            const taskDate = new Date(task.dueDate + 'T00:00:00');
            const daysFromStart = (taskDate - startDate) / (1000 * 60 * 60 * 24);
            const position = (daysFromStart / timeSpan) * 100;
            
            return {
                task,
                position: Math.max(1, Math.min(95, position)),
                level: 0 // Will be calculated to avoid overlaps
            };
        });
        
        // Group tasks by same date and assign priority order
        const dateGroups = new Map();
        markerData.forEach(marker => {
            const dateKey = marker.task.dueDate;
            if (!dateGroups.has(dateKey)) {
                dateGroups.set(dateKey, []);
            }
            dateGroups.get(dateKey).push(marker);
        });
        
        // For each date group, sort by recommended order:
        // 1. Longest tasks first (do hardest when you have most time/energy)
        // 2. Deep focus tasks before lighter tasks
        // 3. Dependencies (if we add that later)
        dateGroups.forEach((group, dateKey) => {
            group.sort((a, b) => {
                // Primary: Sort by time (longest first)
                const timeDiff = (b.task.timeToComplete || 0) - (a.task.timeToComplete || 0);
                if (timeDiff !== 0) return timeDiff;
                
                // Secondary: Deep focus tasks first
                const aDeepFocus = a.task.tags?.includes('deep focus') ? 1 : 0;
                const bDeepFocus = b.task.tags?.includes('deep focus') ? 1 : 0;
                return bDeepFocus - aDeepFocus;
            });
            
            // Assign sequence numbers within same-date groups
            group.forEach((marker, idx) => {
                marker.sequence = group.length > 1 ? idx + 1 : 0;
                marker.totalInGroup = group.length;
            });
        });
        
        // Assign levels to avoid overlaps - improved algorithm
        const levelWidth = 28; // Wider items need more horizontal space (percentage)
        
        // First pass: assign levels based on collision detection
        markerData.forEach((marker, index) => {
            let level = 0;
            let collision = true;
            
            while (collision && level < 15) { // Increased max levels
                collision = false;
                
                // Check against all previously placed markers
                for (let i = 0; i < index; i++) {
                    const other = markerData[i];
                    
                    // If same date, MUST stack vertically (no horizontal overlap allowed)
                    if (marker.task.dueDate === other.task.dueDate) {
                        if (other.level === level) {
                            collision = true;
                            break;
                        }
                    } else {
                        // Different dates - check for horizontal overlap at this level
                        if (other.level === level) {
                            const horizontalGap = Math.abs(marker.position - other.position);
                            
                            // Check if they would overlap horizontally
                            if (horizontalGap < levelWidth) {
                                collision = true;
                                break;
                            }
                        }
                    }
                }
                
                if (collision) level++;
            }
            
            marker.level = level;
        });
        
        // Create markers
        markerData.forEach(({ task, position, level }) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const taskDate = new Date(task.dueDate + 'T00:00:00');
            const daysUntilDue = Math.ceil((taskDate - today) / (1000 * 60 * 60 * 24));
            
            // Calculate wave position for this task
            const daysFromStart = (taskDate - startDate) / (1000 * 60 * 60 * 24);
            const waveY = getWaveY(daysFromStart, timeSpan);
            
            // Determine urgency class with richer gradient
            let urgencyClass = 'future';
            if (daysUntilDue < 0) urgencyClass = 'overdue';
            else if (daysUntilDue === 0) urgencyClass = 'today';
            else if (daysUntilDue === 1) urgencyClass = 'tomorrow';
            else if (daysUntilDue === 2) urgencyClass = 'very-soon';
            else if (daysUntilDue <= 4) urgencyClass = 'soon';
            else if (daysUntilDue <= 7) urgencyClass = 'upcoming';
            
            // Get category color
            const categoryColors = {
                'Psychology 101': 'var(--color-purple)',
                'Neuroscience 201': 'var(--color-blue)', 
                'Research Project': 'var(--color-cyan)',
                'Sports Team': 'var(--color-green)',
                'Consulting': 'var(--color-orange)',
                'House': 'var(--color-pink)',
                'Office': 'var(--color-indigo)',
                'Grant': 'var(--color-yellow)'
            };
            
            const categoryColor = categoryColors[task.category] || 'var(--navy)';
            
            // Create time indicator HTML
            let timeIndicatorHTML = '';
            if (task.timeToComplete) {
                const minutes = task.timeToComplete;
                const hours = Math.floor(minutes / 60);
                const remainingMinutes = minutes % 60;
                
                // Calculate ring percentages (each ring = 60 minutes = 100%)
                let innerPercentage = 0;
                let outerPercentage = 0;
                let showOuter = 0;
                
                if (minutes <= 60) {
                    // First hour: fill inner ring
                    innerPercentage = (minutes / 60) * 100;
                } else {
                    // More than 1 hour: fill inner ring completely, start outer ring
                    innerPercentage = 100;
                    outerPercentage = (remainingMinutes / 60) * 100;
                    showOuter = 1;
                }
                
                const displayTime = hours > 0 
                    ? (remainingMinutes > 0 ? `${hours}h${remainingMinutes}m` : `${hours}h`)
                    : `${minutes}m`;
                
                timeIndicatorHTML = `
                    <div class="timeline-time-indicator">
                        <div class="timeline-time-circle" style="--inner-percentage: ${innerPercentage}; --outer-percentage: ${outerPercentage}; --show-outer: ${showOuter}; --category-color: ${categoryColor}">
                            <div class="timeline-time-circle-center"></div>
                            <span class="timeline-time-circle-text">${displayTime.length > 3 ? minutes + 'm' : displayTime}</span>
                        </div>
                    </div>
                `;
            }
            
            const marker = document.createElement('div');
            marker.className = `timeline-marker level-${level}`;
            marker.style.left = `${position}%`;
            marker.setAttribute('data-task-id', task.id);
            
            // Add sequence indicator for same-date tasks
            const sequenceHTML = markerData.find(m => m.task.id === task.id).sequence > 0
                ? `<div class="timeline-sequence" title="Recommended order: do this ${markerData.find(m => m.task.id === task.id).sequence === 1 ? 'FIRST' : '#' + markerData.find(m => m.task.id === task.id).sequence}">${markerData.find(m => m.task.id === task.id).sequence}</div>`
                : '';
            
            const isGrouped = markerData.find(m => m.task.id === task.id).totalInGroup > 1;
            
            // Calculate dot offset from wave position
            // The marker is positioned by level CSS, but dot needs to align with wave
            const markerTop = getLevelTop(level);
            const itemHeight = 30; // Height of timeline-item
            
            // Calculate where the dot should be (on the wave)
            const dotTopOffset = waveY - markerTop;
            
            // Calculate connector: extend to full vertical extent
            // Wave oscillates from center (234px) with weekly (40px) + daily (15px) amplitude
            const centerY = 234;
            const maxAmplitude = 40 + 15; // Weekly + daily
            const waveTop = centerY - maxAmplitude;
            const waveBottom = centerY + maxAmplitude;
            
            let connectorHeight, connectorTop;
            if (markerTop < centerY) {
                // Item is above center - extend from item top down to wave bottom
                connectorTop = 0;
                connectorHeight = waveBottom - markerTop;
            } else {
                // Item is below center - extend from wave top down to item top
                connectorTop = waveTop - markerTop;
                connectorHeight = markerTop - waveTop + itemHeight;
            }
            
            marker.innerHTML = `
                <div class="timeline-item ${urgencyClass} ${isGrouped ? 'grouped' : ''}" style="border-color: ${urgencyClass === 'future' ? categoryColor : ''}">
                    ${sequenceHTML}
                    <span class="timeline-date">${taskDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span class="timeline-task" title="${task.name}">${task.name}</span>
                    ${timeIndicatorHTML}
                    <span class="timeline-category">${task.category}</span>
                </div>
                <div class="timeline-connector" style="background: ${categoryColor}; height: ${connectorHeight}px; top: ${connectorTop}px;"></div>
                <div class="timeline-dot" style="border-color: ${categoryColor}; top: ${dotTopOffset}px;"></div>
            `;
            
            // Add click handler to scroll to task
            marker.addEventListener('click', () => {
                const taskElement = document.querySelector(`[data-task-id="${task.id}"]`);
                if (taskElement) {
                    // Remove previous highlights
                    document.querySelectorAll('.timeline-highlighted').forEach(el => {
                        el.classList.remove('timeline-highlighted');
                    });
                    
                    // Highlight and scroll to task
                    const taskItem = taskElement.closest('.task-item');
                    if (taskItem) {
                        taskItem.classList.add('timeline-highlighted');
                        taskItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        
                        // Remove highlight after animation
                        setTimeout(() => {
                            taskItem.classList.remove('timeline-highlighted');
                        }, 3000);
                    }
                }
            });
            
            timelineTrack.appendChild(marker);
        });
        
        // Update scale indicator
        document.getElementById('timeline-scale').textContent = `${Math.round(timelineZoom * 100)}% Zoom`;
    }
    
    function updateTimelineZoom(direction, delta = zoomStep) {
        if (direction === 'in' && timelineZoom < maxZoom) {
            timelineZoom = Math.min(maxZoom, timelineZoom + delta);
        } else if (direction === 'out' && timelineZoom > minZoom) {
            timelineZoom = Math.max(minZoom, timelineZoom - delta);
        }
        renderTimeline();
    }

    // Mouse wheel zoom functionality and pan with Ctrl/Cmd
    function initializeTimelineZoom() {
        const timelineContainer = document.getElementById('timeline-container');
        const timelineTrack = document.getElementById('timeline-track');
        if (!timelineContainer || !timelineTrack) return;

        // Wheel zoom (without modifier keys)
        timelineContainer.addEventListener('wheel', (e) => {
            // Pan with Ctrl/Cmd+wheel
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                timelinePanX -= e.deltaX;
                timelinePanY -= e.deltaY;
                applyTimelineTransform();
                return;
            }
            
            // Zoom with regular wheel
            e.preventDefault();
            const direction = e.deltaY < 0 ? 'in' : 'out';
            const delta = Math.abs(e.deltaY) * 0.001;
            updateTimelineZoom(direction, Math.min(delta, 0.2));
        });
        
        // Pan with Ctrl/Cmd+drag
        timelineContainer.addEventListener('mousedown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                isPanning = true;
                panStartX = e.clientX - timelinePanX;
                panStartY = e.clientY - timelinePanY;
                timelineContainer.classList.add('panning');
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isPanning) {
                e.preventDefault();
                timelinePanX = e.clientX - panStartX;
                timelinePanY = e.clientY - panStartY;
                applyTimelineTransform();
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (isPanning) {
                isPanning = false;
                timelineContainer.classList.remove('panning');
            }
        });
    }
    
    // --- EVENT LISTENERS ---
    getTaskBtn.addEventListener('click', getSuggestedTask);
    
    // Export/Import functionality
    document.getElementById('export-btn').addEventListener('click', exportTasks);
    document.getElementById('import-file').addEventListener('change', importTasks);
    
    // Timeline zoom controls
    document.getElementById('zoom-in').addEventListener('click', () => updateTimelineZoom('in'));
    document.getElementById('zoom-out').addEventListener('click', () => updateTimelineZoom('out'));

    // --- INITIALIZATION ---
    renderTasks();
    initializeTimelineZoom();
});
