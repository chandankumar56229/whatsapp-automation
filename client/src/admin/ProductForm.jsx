import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/client.js';
import { createProduct, updateProduct, uploadImage } from '../api/products.js';

const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const empty = {
  slug: '', name: '', tagline: '', category: 'CRM & Business', description: '',
  tags: [], image: '', gallery: [],
  pricing: [{ tier: 'Regular License', price: 49, description: '' }],
  rating: 5, salesCount: 0, version: '1.0.0', publishDate: '', supportDuration: '6 months',
  features: [], techStack: { backend: [], frontend: [], database: [], deployment: [] },
  reviews: [], isPublished: true, isComingSoon: false,
};

function ChipInput({ value = [], onChange, placeholder }) {
  const [text, setText] = useState('');
  const add = () => {
    const v = text.trim();
    if (v && !value.includes(v)) onChange([...value, v]);
    setText('');
  };
  return (
    <div className="border-2 border-gray-200 rounded-lg p-2 focus-within:border-primary transition">
      <div className="flex flex-wrap gap-1.5 mb-1.5">
        {value.map((v, i) => (
          <span key={i} className="px-2 py-0.5 bg-gray-100 rounded text-sm flex items-center gap-1.5">
            {v}
            <button type="button" onClick={() => onChange(value.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500">×</button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }}
        onBlur={add}
        className="w-full outline-none text-sm py-1"
        placeholder={placeholder || 'Type and press Enter'}
      />
    </div>
  );
}

function Field({ label, children, hint }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

const Input = (props) => (
  <input {...props} className={`w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none transition ${props.className || ''}`} />
);
const TextArea = (props) => (
  <textarea {...props} className={`w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none transition ${props.className || ''}`} />
);

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [data, setData] = useState(empty);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    api.get('/api/products', { params: { includeUnpublished: true } })
      .then((r) => {
        const found = r.data.products.find((p) => p._id === id);
        if (found) setData({ ...empty, ...found });
        else setError('Product not found');
      })
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = (patch) => setData((d) => ({ ...d, ...patch }));

  const onUploadMain = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      set({ image: url });
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onUploadGallery = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map((f) => uploadImage(f).then((r) => r.url)));
      set({ gallery: [...(data.gallery || []), ...urls] });
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onNameChange = (name) => {
    set({ name, slug: data.slug && isEdit ? data.slug : slugify(name) });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (isEdit) await updateProduct(id, data);
      else await createProduct(data);
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-500">Loading…</p>;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/admin/products" className="text-sm text-gray-500 hover:text-primary">← Back</Link>
          <h1 className="font-heading text-3xl font-bold text-primary mt-1">
            {isEdit ? 'Edit Product' : 'New Product'}
          </h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {/* BASICS */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-heading font-bold text-lg text-primary">Basics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Name *">
              <Input required value={data.name} onChange={(e) => onNameChange(e.target.value)} />
            </Field>
            <Field label="Slug *" hint="URL-safe identifier (used in /product/:slug)">
              <Input required value={data.slug} onChange={(e) => set({ slug: slugify(e.target.value) })} />
            </Field>
          </div>
          <Field label="Tagline">
            <Input value={data.tagline} onChange={(e) => set({ tagline: e.target.value })} placeholder="Short subtitle shown on cards" />
          </Field>
          <Field label="Category">
            <Input value={data.category} onChange={(e) => set({ category: e.target.value })} />
          </Field>
          <Field label="Tags" hint="Press Enter or comma to add">
            <ChipInput value={data.tags} onChange={(tags) => set({ tags })} />
          </Field>
        </section>

        {/* DESCRIPTION */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-heading font-bold text-lg text-primary">Description</h2>
          <Field label="Long description" hint="Use blank lines to split into paragraphs">
            <TextArea rows={6} value={data.description} onChange={(e) => set({ description: e.target.value })} />
          </Field>
        </section>

        {/* MEDIA */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-heading font-bold text-lg text-primary">Media</h2>
          <Field label="Main image">
            <div className="flex items-center gap-4">
              {data.image && <img src={data.image} alt="" className="w-32 h-20 object-cover rounded border border-gray-200" />}
              <label className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold cursor-pointer transition">
                <i className="fa-solid fa-upload mr-2" />
                {uploading ? 'Uploading…' : 'Choose image'}
                <input type="file" accept="image/*" className="hidden" onChange={onUploadMain} />
              </label>
              {data.image && (
                <button type="button" onClick={() => set({ image: '' })} className="text-sm text-red-600 hover:underline">Remove</button>
              )}
            </div>
          </Field>
          <Field label="Gallery">
            <label className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold cursor-pointer transition">
              <i className="fa-solid fa-images mr-2" /> Add images
              <input type="file" accept="image/*" multiple className="hidden" onChange={onUploadGallery} />
            </label>
            {data.gallery?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {data.gallery.map((url, i) => (
                  <div key={i} className="relative w-24 h-24 rounded border border-gray-200 overflow-hidden">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => set({ gallery: data.gallery.filter((_, idx) => idx !== i) })}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/70 text-white rounded-full text-xs"
                    >×</button>
                  </div>
                ))}
              </div>
            )}
          </Field>
        </section>

        {/* PRICING */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-heading font-bold text-lg text-primary">Pricing tiers</h2>
          {data.pricing.map((p, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end">
              <div className="md:col-span-4"><Field label={i === 0 ? 'Tier name' : ''}>
                <Input value={p.tier} onChange={(e) => set({ pricing: data.pricing.map((x, idx) => idx === i ? { ...x, tier: e.target.value } : x) })} />
              </Field></div>
              <div className="md:col-span-2"><Field label={i === 0 ? 'Price (USD)' : ''}>
                <Input type="number" min="0" step="0.01" value={p.price} onChange={(e) => set({ pricing: data.pricing.map((x, idx) => idx === i ? { ...x, price: Number(e.target.value) } : x) })} />
              </Field></div>
              <div className="md:col-span-5"><Field label={i === 0 ? 'Description' : ''}>
                <Input value={p.description || ''} onChange={(e) => set({ pricing: data.pricing.map((x, idx) => idx === i ? { ...x, description: e.target.value } : x) })} />
              </Field></div>
              <div className="md:col-span-1">
                <button type="button" onClick={() => set({ pricing: data.pricing.filter((_, idx) => idx !== i) })} className="px-3 py-2 text-red-600 hover:bg-red-50 rounded">×</button>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => set({ pricing: [...data.pricing, { tier: '', price: 0, description: '' }] })}
            className="text-sm text-primary hover:underline">+ Add pricing tier</button>
        </section>

        {/* FEATURES */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-heading font-bold text-lg text-primary">Features</h2>
          {data.features.map((f, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end">
              <div className="md:col-span-3"><Field label={i === 0 ? 'Icon (FontAwesome)' : ''}>
                <Input placeholder="fa-rocket" value={f.icon || ''} onChange={(e) => set({ features: data.features.map((x, idx) => idx === i ? { ...x, icon: e.target.value } : x) })} />
              </Field></div>
              <div className="md:col-span-3"><Field label={i === 0 ? 'Title' : ''}>
                <Input value={f.title} onChange={(e) => set({ features: data.features.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x) })} />
              </Field></div>
              <div className="md:col-span-5"><Field label={i === 0 ? 'Description' : ''}>
                <Input value={f.description || ''} onChange={(e) => set({ features: data.features.map((x, idx) => idx === i ? { ...x, description: e.target.value } : x) })} />
              </Field></div>
              <div className="md:col-span-1">
                <button type="button" onClick={() => set({ features: data.features.filter((_, idx) => idx !== i) })} className="px-3 py-2 text-red-600 hover:bg-red-50 rounded">×</button>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => set({ features: [...data.features, { icon: '', title: '', description: '' }] })}
            className="text-sm text-primary hover:underline">+ Add feature</button>
        </section>

        {/* TECH STACK */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-heading font-bold text-lg text-primary">Tech Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['backend', 'frontend', 'database', 'deployment'].map((key) => (
              <Field key={key} label={key[0].toUpperCase() + key.slice(1)}>
                <ChipInput
                  value={data.techStack?.[key] || []}
                  onChange={(items) => set({ techStack: { ...data.techStack, [key]: items } })}
                />
              </Field>
            ))}
          </div>
        </section>

        {/* META */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-heading font-bold text-lg text-primary">Meta</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Field label="Version"><Input value={data.version} onChange={(e) => set({ version: e.target.value })} /></Field>
            <Field label="Publish date"><Input value={data.publishDate} onChange={(e) => set({ publishDate: e.target.value })} placeholder="April 2025" /></Field>
            <Field label="Support"><Input value={data.supportDuration} onChange={(e) => set({ supportDuration: e.target.value })} /></Field>
            <Field label="Sales count"><Input type="number" min="0" value={data.salesCount} onChange={(e) => set({ salesCount: Number(e.target.value) })} /></Field>
            <Field label="Rating"><Input type="number" min="0" max="5" step="0.1" value={data.rating} onChange={(e) => set({ rating: Number(e.target.value) })} /></Field>
          </div>
        </section>

        {/* FLAGS */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={data.isPublished} onChange={(e) => set({ isPublished: e.target.checked })} className="w-4 h-4" />
            <span className="text-sm font-semibold">Published</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={data.isComingSoon} onChange={(e) => set({ isComingSoon: e.target.checked })} className="w-4 h-4" />
            <span className="text-sm font-semibold">Coming Soon</span>
          </label>
        </section>

        {/* SUBMIT */}
        <div className="flex items-center justify-end gap-3 sticky bottom-0 bg-gray-50 py-4 border-t border-gray-200">
          <Link to="/admin/products" className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</Link>
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-6 py-2.5 bg-primary text-white rounded-lg font-heading font-bold text-sm hover:bg-gray-800 disabled:opacity-60 transition"
          >
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
