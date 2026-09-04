import { db } from '../db.js';

export function handleReminderRoutes(req, res, url, body) {
  // GET /api/reminders
  if (url.pathname === '/api/reminders' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ reminders: db.store.reminders }));
  }

  // PUT /api/reminders/:id/toggle
  const matchToggle = url.pathname.match(/^\/api\/reminders\/([^/]+)\/toggle$/);
  if (matchToggle && (req.method === 'PUT' || req.method === 'POST')) {
    const id = matchToggle[1];
    const reminder = db.store.reminders.find(r => r.id === id);
    if (!reminder) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: "Reminder not found" }));
    }

    reminder.active = !reminder.active;
    db.saveStore();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      message: `Reminder ${reminder.title} is now ${reminder.active ? 'active' : 'paused'}`,
      reminder
    }));
  }

  // POST /api/reminders (Create custom alarm)
  if (url.pathname === '/api/reminders' && req.method === 'POST') {
    const newRem = {
      id: `r_${Date.now()}`,
      title: body.title || "Custom Alarm",
      time: body.time || "08:00 AM",
      repeat: body.repeat || "Everyday",
      type: body.type || "custom",
      icon: body.icon || "bell",
      active: true
    };
    db.store.reminders.push(newRem);
    db.saveStore();
    res.writeHead(201, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: "Alarm created", reminder: newRem }));
  }

  // PUT /api/reminders/:id (Update alarm time or properties)
  const matchUpdate = url.pathname.match(/^\/api\/reminders\/([^/]+)$/);
  if (matchUpdate && (req.method === 'PUT' || req.method === 'POST')) {
    const id = matchUpdate[1];
    const reminder = db.store.reminders.find(r => r.id === id);
    if (!reminder) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: "Reminder not found" }));
    }

    if (body.time) reminder.time = body.time;
    if (body.repeat) reminder.repeat = body.repeat;
    if (body.title) reminder.title = body.title;
    if (typeof body.active === 'boolean') reminder.active = body.active;
    db.saveStore();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      message: `Alarm ${reminder.title} updated to ${reminder.time}`,
      reminder
    }));
  }

  return false;
}
