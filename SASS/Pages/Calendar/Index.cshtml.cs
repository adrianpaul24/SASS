//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.AspNetCore.Mvc.RazorPages;
//using Microsoft.EntityFrameworkCore;
//using SASS.Data;
//using SASS.Models;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;

//namespace SASS.Pages.Calendar
//{
//    [Authorize]
//    public class IndexModel : PageModel
//    {
//        private readonly ApplicationDbContext _context;

//        public IndexModel(ApplicationDbContext context)
//        {
//            _context = context;
//        }

//        public async Task<IActionResult> OnGetAppointments()
//        {
//            var appointments = await _context.Appointments
//                .Select(a => new
//                {
//                    id = a.Id,
//                    title = "Appointment with " + a.Id, // You can change this to actual patient name
//                    start = a.AppointmentDate.ToString("yyyy-MM-ddTHH:mm:ss") // Convert to ISO format
//                })
//                .ToListAsync();

//            return new JsonResult(appointments);
//        }
//    }
//}

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using SASS.Data;
using SASS.Models;
using System;
using System.Threading.Tasks;

namespace SASS.Pages.Calendar
{
    public class IndexModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        public IndexModel(ApplicationDbContext context)
        {
            _context = context;
        }

        [BindProperty]
        public Appointments NewAppointment { get; set; }

        // Method to handle the POST request from the frontend
        public async Task<IActionResult> OnPostCreateAppointmentAsync([FromBody] Appointments appointment)
        {
            if (appointment == null)
            {
                return BadRequest(new { success = false, message = "Invalid data" });
            }

            // Create the appointment in the database
            appointment.DateCreated = DateTime.UtcNow;
            appointment.DateModified = DateTime.UtcNow;
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            // Create an appointment log
            var log = new AppointmentLogs
            {
                AppointmentId = appointment.Id,
                Action = "Created",
                Timestamp = DateTime.UtcNow,
                ChangedByUserId = appointment.AssignedTo // Assuming assigned user creates the appointment
            };
            _context.AppointmentLogs.Add(log);

            // Create a reminder for the appointment (example: 1 hour before)
            var reminder = new Reminders
            {
                AppointmentId = appointment.Id,
                Type = "Pre-Appointment", // Example reminder type
                Date = appointment.AppointmentDate.Add(appointment.StartTime).AddHours(-1), // 1 hour before the appointment
                Status = "Pending"
            };
            _context.Reminders.Add(reminder);

            await _context.SaveChangesAsync();

            return new JsonResult(new { success = true, id = appointment.Id });
        }

        // Method to get existing appointments (optional - if you want to load existing appointments when the page loads)
        public IActionResult OnGetAppointments()
        {
            var appointments = _context.Appointments
                                       .Include(a => a.AssignedTo)
                                       .ToList();
            return new JsonResult(new { appointments });
        }
    }
}

