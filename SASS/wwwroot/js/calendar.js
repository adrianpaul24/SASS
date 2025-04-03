document.addEventListener("DOMContentLoaded", function () {
    // Initialize Calendar
    var calendar = new tui.Calendar('#calendar', {
        defaultView: 'month',
        useFormPopup: false, // Using custom popup
        useDetailPopup: true,
        calendars: [
            {
                id: '1',
                name: 'Appointments',
                backgroundColor: '#03a9f4',
                borderColor: '#0288d1'
            }
        ]
    });

    function updateMonthYear() {
        const date = calendar.getDate();
        const monthYear = date.toDate().toLocaleString('default', { month: 'long', year: 'numeric' });
        document.getElementById('currentMonthYear').innerText = monthYear;
    }

    updateMonthYear();

    // Show modal when clicking on a date/time
    calendar.on('selectDateTime', function (event) {
        document.getElementById('appointmentModal').style.display = 'block';
        document.getElementById('appointmentStart').value = event.start.toISOString().slice(0, 16);
        document.getElementById('appointmentEnd').value = event.end.toISOString().slice(0, 16);
    });

    // Close modal
    document.getElementById('closeModal').addEventListener('click', function () {
        document.getElementById('appointmentModal').style.display = 'none';
    });

    // Save appointment
    document.getElementById('saveAppointment').addEventListener('click', function () {
        var title = document.getElementById('appointmentTitle').value;
        var start = document.getElementById('appointmentStart').value;
        var end = document.getElementById('appointmentEnd').value;

        if (title && start && end) {
            var newEvent = {
                id: String(Date.now()), // Temporary ID
                calendarId: '1',
                title: title,
                category: 'time',
                start: start,
                end: end
            };

            // Add event to calendar
            calendar.createEvents([newEvent]);

            // Send data to backend
            fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEvent)
            });

            document.getElementById('appointmentModal').style.display = 'none';
        }
    });

    // Navigation Buttons
    document.getElementById('prevMonth').addEventListener('click', function () {
        calendar.prev();
        updateMonthYear();
    });

    document.getElementById('nextMonth').addEventListener('click', function () {
        calendar.next();
        updateMonthYear();
    });
});

//document.addEventListener("DOMContentLoaded", function () {
//    // Initialize Calendar
//    var calendar = new tui.Calendar('#calendar', {
//        defaultView: 'month',
//        useFormPopup: false, // Using custom popup
//        useDetailPopup: true,
//        calendars: [
//            {
//                id: '1',
//                name: 'Appointments',
//                backgroundColor: '#03a9f4',
//                borderColor: '#0288d1'
//            }
//        ]
//    });

//    function updateMonthYear() {
//        const date = calendar.getDate();
//        const monthYear = date.toDate().toLocaleString('default', { month: 'long', year: 'numeric' });
//        document.getElementById('currentMonthYear').innerText = monthYear;
//    }

//    updateMonthYear();

//    // Show modal when clicking on a date/time
//    calendar.on('selectDateTime', function (event) {
//        document.getElementById('appointmentModal').style.display = 'block';
//        document.getElementById('appointmentStart').value = event.start.toISOString().slice(0, 16);
//        document.getElementById('appointmentEnd').value = event.end.toISOString().slice(0, 16);
//    });

//    // Close modal
//    document.getElementById('closeModal').addEventListener('click', function () {
//        document.getElementById('appointmentModal').style.display = 'none';
//    });

//    // Save appointment
//    document.getElementById('saveAppointment').addEventListener('click', function () {
//        var title = document.getElementById('appointmentTitle').value;
//        var start = document.getElementById('appointmentStart').value;
//        var end = document.getElementById('appointmentEnd').value;
//        var assignedTo = 1; // Assuming user ID for the example, update this dynamically

//        if (title && start && end) {
//            var newEvent = {
//                title: title,
//                start: start,
//                end: end,
//                assignedTo: assignedTo // Add user ID
//            };

//            // Add event to calendar (client-side)
//            calendar.createEvents([{
//                id: String(Date.now()), // Temporary ID
//                calendarId: '1',
//                title: title,
//                category: 'time',
//                start: start,
//                end: end
//            }]);

//            // Send data to backend (server-side)
//            fetch('/Calendar/CreateAppointment', {
//                method: 'POST',
//                headers: { 'Content-Type': 'application/json' },
//                body: JSON.stringify(newEvent)
//            })
//                .then(response => response.json())
//                .then(data => {
//                    if (data.success) {
//                        alert('Appointment created successfully!');
//                        // Optionally, refresh the calendar to show the new appointment with the correct ID
//                        calendar.clear();
//                        loadAppointments();
//                    } else {
//                        alert('Failed to create appointment.');
//                    }
//                })
//                .catch(error => console.error('Error:', error));

//            // Close the modal
//            document.getElementById('appointmentModal').style.display = 'none';
//        }
//    });

//    // Navigation Buttons
//    document.getElementById('prevMonth').addEventListener('click', function () {
//        calendar.prev();
//        updateMonthYear();
//    });

//    document.getElementById('nextMonth').addEventListener('click', function () {
//        calendar.next();
//        updateMonthYear();
//    });

//    // Load existing appointments (optional - you can load them initially if needed)
//    function loadAppointments() {
//        fetch('/Calendar/GetAppointments')
//            .then(response => response.json())
//            .then(data => {
//                if (data && data.appointments) {
//                    data.appointments.forEach(appointment => {
//                        calendar.createEvents([{
//                            id: appointment.id,
//                            calendarId: '1',
//                            title: appointment.title,
//                            category: 'time',
//                            start: appointment.start,
//                            end: appointment.end
//                        }]);
//                    });
//                }
//            })
//            .catch(error => console.error('Error loading appointments:', error));
//    }

//    loadAppointments();
//});
