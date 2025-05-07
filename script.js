
        // Store data for demo purposes (this would be handled by a backend in a real application)
        let teacherData = [];
        let channelData = [];
        let studentData = [];
        let enrollments = [];
        let currentUser = null;
        
        // Display functions
        function showPage(pageId) {
            // Hide all page sections
            document.querySelectorAll('.page-section').forEach(section => {
                section.classList.add('hidden');
            });
            
            // Show the selected page
            document.getElementById(pageId).classList.remove('hidden');
            
            // Update active nav link
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('onclick').includes(pageId)) {
                    link.classList.add('active');
                }
            });
        }
        
        function switchTab(tabId, tabElement) {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.add('hidden');
            });
            
            // Show the selected tab content
            document.getElementById(tabId).classList.remove('hidden');
            
            // Update active tab
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            tabElement.classList.add('active');
        }
        
        // Teacher functions
        function registerTeacher() {
            const name = document.getElementById('teacherName').value;
            const email = document.getElementById('teacherEmail').value;
            const password = document.getElementById('teacherPassword').value;
            const subjects = document.getElementById('teacherSubjects').value;
            const bio = document.getElementById('teacherBio').value;
            
            if (!name || !email || !password || !subjects || !bio) {
                alert('Please fill out all fields');
                return;
            }
            
            const teacher = {
                id: teacherData.length + 1,
                name,
                email,
                password,
                subjects,
                bio,
                channels: []
            };
            
            teacherData.push(teacher);
            alert('Teacher registration successful! Please log in.');
            
            // Clear form and switch to login tab
            document.getElementById('teacherRegisterForm').reset();
            switchTab('login', document.querySelector('.tab'));
        }
        
        function loginTeacher() {
            const email = document.getElementById('teacherLoginEmail').value;
            const password = document.getElementById('teacherLoginPassword').value;
            
            const teacher = teacherData.find(t => t.email === email && t.password === password);
            
            if (teacher) {
                currentUser = { ...teacher, type: 'teacher' };
                document.getElementById('teacher-login').classList.add('hidden');
                document.getElementById('teacher-dashboard').classList.remove('hidden');
                
                // Display teacher info
                document.getElementById('teacherInfo').innerHTML = `
                    <div class="alert alert-info">
                        <h3>Welcome, ${teacher.name}!</h3>
                        <p>Email: ${teacher.email}</p>
                        <p>Subjects: ${teacher.subjects}</p>
                    </div>
                `;
                
                // Display teacher's channels
                updateTeacherChannels();
            } else {
                alert('Invalid email or password. For demo purposes, please register first.');
            }
        }
        
        function createChannel() {
            if (!currentUser || currentUser.type !== 'teacher') {
                alert('Please log in as a teacher first');
                return;
            }
            
            const title = document.getElementById('channelTitle').value;
            const description = document.getElementById('channelDescription').value;
            const category = document.getElementById('channelCategory').value;
            const tags = document.getElementById('channelTags').value.split(',').map(tag => tag.trim());
            
            if (!title || !description || !category) {
                alert('Please fill out all required fields');
                return;
            }
            
            const channel = {
                id: channelData.length + 1,
                teacherId: currentUser.id,
                teacherName: currentUser.name,
                title,
                description,
                category,
                tags,
                students: 0,
                createdAt: new Date().toISOString()
            };
            
            channelData.push(channel);
            currentUser.channels.push(channel.id);
            
            // Update the teacher channels list
            updateTeacherChannels();
            
            // Clear the form
            document.getElementById('createChannelForm').reset();
            
            // Show success message
            alert('Channel created successfully!');
        }
        
        function updateTeacherChannels() {
            const channelsContainer = document.getElementById('teacherChannels');
            channelsContainer.innerHTML = '';
            
            const teacherChannels = channelData.filter(channel => channel.teacherId === currentUser.id);
            
            if (teacherChannels.length === 0) {
                channelsContainer.innerHTML = '<p>You haven\'t created any channels yet.</p>';
                return;
            }
            
            teacherChannels.forEach(channel => {
                const channelElement = document.createElement('div');
                channelElement.className = 'card';
                channelElement.innerHTML = `
                    <h3>${channel.title}</h3>
                    <p>${channel.description}</p>
                    <div>
                        <span class="tag">${channel.category}</span>
                        ${channel.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="card-footer">
                        <span>${channel.students} Students Enrolled</span>
                        <button onclick="editChannel(${channel.id})">Edit Channel</button>
                    </div>
                `;
                channelsContainer.appendChild(channelElement);
            });
        }
        
        // Student functions
        function registerStudent() {
            const name = document.getElementById('studentName').value;
            const email = document.getElementById('studentEmail').value;
            const password = document.getElementById('studentPassword').value;
            const grade = document.getElementById('studentGrade').value;
            
            if (!name || !email || !password || !grade) {
                alert('Please fill out all required fields');
                return;
            }
            
            // Get selected interests
            const interests = [];
            document.querySelectorAll('input[name="interests"]:checked').forEach(checkbox => {
                interests.push(checkbox.value);
            });
            
            const student = {
                id: studentData.length + 1,
                name,
                email,
                password,
                grade,
                interests,
                enrolledChannels: []
            };
            
            studentData.push(student);
            alert('Student registration successful! You can now browse and enroll in channels.');
            
            // Clear form and go to browse channels
            document.getElementById('studentSignupForm').reset();
            showPage('browse-channels');
        }
        
        function enrollChannel(channelId) {
            if (studentData.length === 0) {
                alert('Please sign up as a student first to enroll in channels');
                showPage('student-signup');
                return;
            }
            
            // For demo purposes, we'll assume the last registered student is enrolling
            const student = studentData[studentData.length - 1];
            
            // Find the channel
            const channel = channelData.find(c => c.id === channelId);
            
            if (!channel) {
                // If channel isn't in our mock data, use the sample channels in the HTML
                alert('You have successfully enrolled in this channel!');
                return;
            }
            
            // Check if already enrolled
            if (student.enrolledChannels.includes(channelId)) {
                alert('You are already enrolled in this channel');
                return;
            }
            
            // Add enrollment
            student.enrolledChannels.push(channelId);
            channel.students++;
            
            enrollments.push({
                studentId: student.id,
                channelId: channelId,
                enrolledAt: new Date().toISOString()
            });
            
            alert(`Successfully enrolled in "${channel.title}" by ${channel.teacherName}!`);
        }
        
        // Channel browsing functions
        function filterCategory(category) {
            const channels = document.querySelectorAll('#channelsList .card');
            
            channels.forEach(channel => {
                if (category === 'all' || channel.getAttribute('data-category') === category) {
                    channel.style.display = 'block';
                } else {
                    channel.style.display = 'none';
                }
            });
        }
        
        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            showPage('home');
        });
        
        // Mock data for editing (placeholder)
        function editChannel(channelId) {
            alert(`Edit functionality for channel ${channelId} would be implemented here.`);
        }
    
