import { useEffect, useState } from 'react';
import { listMessages, markRead, deleteMessage } from '../api/contact.js';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = () => {
    setLoading(true);
    listMessages().then(setMessages).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const onSelect = async (m) => {
    setSelected(m);
    if (!m.isRead) {
      await markRead(m._id).catch(() => {});
      load();
    }
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    await deleteMessage(id);
    if (selected?._id === id) setSelected(null);
    load();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-primary">Messages</h1>
        <p className="text-gray-500 mt-1">{messages.length} total · {messages.filter((m) => !m.isRead).length} unread</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
            {loading && <p className="p-6 text-gray-400 text-sm">Loading…</p>}
            {!loading && messages.length === 0 && <p className="p-6 text-gray-400 text-sm">No messages yet.</p>}
            {messages.map((m) => (
              <button
                key={m._id}
                onClick={() => onSelect(m)}
                className={`w-full text-left px-5 py-4 hover:bg-gray-50 transition ${selected?._id === m._id ? 'bg-gray-50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm text-primary">{m.name}</div>
                  {!m.isRead && <span className="text-xs px-2 py-0.5 rounded bg-orange-50 text-orange-700">New</span>}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{m.email} · {m.subject}</div>
                <div className="text-sm text-gray-600 mt-1 line-clamp-2">{m.message}</div>
                <div className="text-xs text-gray-400 mt-1">{new Date(m.createdAt).toLocaleString()}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {!selected ? (
            <p className="text-gray-400 text-sm text-center py-12">Select a message to view it.</p>
          ) : (
            <>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-heading font-bold text-xl text-primary">{selected.name}</div>
                  <a href={`mailto:${selected.email}`} className="text-sm text-gray-500 hover:text-primary">{selected.email}</a>
                  <div className="text-xs text-gray-400 mt-1">{new Date(selected.createdAt).toLocaleString()}</div>
                </div>
                <button onClick={() => onDelete(selected._id)} className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded text-sm">
                  <i className="fa-solid fa-trash mr-1" /> Delete
                </button>
              </div>
              <div className="text-sm font-semibold text-gray-700 mb-1">Subject</div>
              <div className="mb-4 text-gray-600">{selected.subject}</div>
              <div className="text-sm font-semibold text-gray-700 mb-1">Message</div>
              <div className="text-gray-600 whitespace-pre-wrap leading-relaxed">{selected.message}</div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                   className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-heading font-bold text-sm hover:bg-gray-800 transition">
                  <i className="fa-solid fa-reply" /> Reply via email
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
