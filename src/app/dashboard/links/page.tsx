'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PageLoader } from '@/components/ui/PageLoader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2, Link2, Phone, MessageCircle, Instagram, MapPin, Mail, Globe, Eye, EyeOff, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Link as LinkType, LinkType as LinkTypeEnum } from '@/lib/types';

const linkTypes: { value: LinkTypeEnum; label: string; icon: React.ReactNode; placeholder: string }[] = [
  { value: 'url', label: 'URL', icon: <Globe className="w-4 h-4" />, placeholder: 'https://example.com' },
  { value: 'phone', label: 'Phone', icon: <Phone className="w-4 h-4" />, placeholder: '9876543210' },
  { value: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="w-4 h-4" />, placeholder: '9876543210' },
  { value: 'instagram', label: 'Instagram', icon: <Instagram className="w-4 h-4" />, placeholder: 'username or URL' },
  { value: 'maps', label: 'Google Maps', icon: <MapPin className="w-4 h-4" />, placeholder: 'Address or Google Maps URL' },
  { value: 'email', label: 'Email', icon: <Mail className="w-4 h-4" />, placeholder: 'hello@example.com' },
  { value: 'custom', label: 'Custom', icon: <Link2 className="w-4 h-4" />, placeholder: 'https://...' },
];

function formatUrlForSave(type: LinkTypeEnum, value: string): string {
  if (!value) return '';
  switch (type) {
    case 'whatsapp': {
      if (value.startsWith('https://wa.me/')) return value;
      const cleaned = value.replace(/\D/g, '');
      return cleaned ? `https://wa.me/${cleaned}` : value;
    }
    case 'phone': {
      if (value.startsWith('tel:')) return value;
      const digits = value.replace(/[^\d+]/g, '');
      return digits ? `tel:${digits}` : value;
    }
    case 'email': {
      if (value.startsWith('mailto:')) return value;
      return `mailto:${value}`;
    }
    case 'instagram': {
      if (value.startsWith('http')) return value;
      return `https://instagram.com/${value.replace('@', '')}`;
    }
    case 'maps': {
      if (value.startsWith('http')) return value;
      return `https://maps.google.com/?q=${encodeURIComponent(value)}`;
    }
    default:
      return value;
  }
}

function getDisplayValue(type: LinkTypeEnum, url: string): string {
  if (!url) return '';
  switch (type) {
    case 'phone': return url.replace('tel:', '');
    case 'email': return url.replace('mailto:', '');
    case 'whatsapp': return url.replace('https://wa.me/', '');
    default: return url;
  }
}

function SortableLinkCard({
  link,
  onSave,
  onDelete,
  onToggle,
}: {
  link: LinkType;
  onSave: (id: string, data: Partial<LinkType>) => Promise<void>;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const typeMeta = linkTypes.find((t) => t.value === link.type);
  const [label, setLabel] = useState(link.label);
  const [urlValue, setUrlValue] = useState(getDisplayValue(link.type, link.url));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const isDirty = label !== link.label || urlValue !== getDisplayValue(link.type, link.url);

  const handleSave = async () => {
    setSaving(true);
    await onSave(link.id, {
      label,
      url: formatUrlForSave(link.type, urlValue),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTypeChange = (newType: LinkTypeEnum) => {
    onSave(link.id, { type: newType, url: '', icon: null });
    setUrlValue('');
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-card border border-border rounded-2xl p-4 space-y-3"
    >
      <div className="flex items-center gap-3">
        <button
          className="cursor-grab active:cursor-grabbing text-muted/40 hover:text-muted transition-colors touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
          {typeMeta?.icon || <Link2 className="w-4 h-4" />}
        </div>

        <select
          value={link.type}
          onChange={(e) => handleTypeChange(e.target.value as LinkTypeEnum)}
          className="text-xs font-medium bg-transparent border border-border rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-accent"
        >
          {linkTypes.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        <div className="flex items-center gap-1 ml-auto shrink-0">
          <button
            onClick={() => onToggle(link.id)}
            className="text-muted/40 hover:text-muted transition-colors p-1"
            title={link.is_active ? 'Hide link' : 'Show link'}
          >
            {link.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => onDelete(link.id)}
            className="text-muted/40 hover:text-red-500 transition-colors p-1"
            title="Delete link"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Label (e.g. Visit our website)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="text-sm !py-1.5"
        />
        <Input
          placeholder={typeMeta?.placeholder || 'URL'}
          value={urlValue}
          onChange={(e) => setUrlValue(e.target.value)}
          className="text-sm !py-1.5"
        />
      </div>

      {isDirty && (
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={handleSave}
            loading={saving}
            disabled={saving}
          >
            {saved ? (
              <><Check className="w-3.5 h-3.5 mr-1" /> Saved</>
            ) : (
              'Save'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function LinksEditorPage() {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setProfileId(user.id);

      const { data } = await supabase
        .from('links')
        .select('*')
        .eq('profile_id', user.id)
        .order('position');

      if (data) setLinks(data);
      setLoading(false);
    }
    load();
  }, []);

  const addLink = async (type: LinkTypeEnum = 'url', label = 'New Link', url = '') => {
    if (!profileId) return;
    const position = links.length;
    const supabase = createClient();

    const { data, error } = await supabase
      .from('links')
      .insert({
        profile_id: profileId,
        type,
        label,
        url,
        position,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      toast.error(error.message);
      return;
    }

    setLinks([...links, data]);
    setShowAddModal(false);
    toast.success('Link added — edit and save');
  };

  const saveLink = async (id: string, data: Partial<LinkType>) => {
    setLinks(links.map((l) => (l.id === id ? { ...l, ...data } : l)));

    const supabase = createClient();
    const { error } = await supabase
      .from('links')
      .update(data)
      .eq('id', id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Saved');
    }
  };

  const deleteLink = async (id: string) => {
    setLinks(links.filter((l) => l.id !== id));

    const supabase = createClient();
    const { error } = await supabase.from('links').delete().eq('id', id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Link removed');
  };

  const toggleLink = async (id: string) => {
    const link = links.find((l) => l.id === id);
    if (!link) return;

    const newActive = !link.is_active;
    setLinks(links.map((l) => (l.id === id ? { ...l, is_active: newActive } : l)));

    const supabase = createClient();
    const { error } = await supabase
      .from('links')
      .update({ is_active: newActive })
      .eq('id', id);

    if (error) toast.error(error.message);
  };

  const pendingReorderRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSaveOrder = useCallback((items: { id: string; position: number; profile_id: string }[]) => {
    if (pendingReorderRef.current) {
      clearTimeout(pendingReorderRef.current);
    }
    pendingReorderRef.current = setTimeout(async () => {
      const supabase = createClient();
      const { error } = await supabase.from('links').upsert(items);
      if (error) toast.error('Failed to save order');
      else toast.success('Order saved');
    }, 800);
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex((l) => l.id === active.id);
    const newIndex = links.findIndex((l) => l.id === over.id);

    const reordered = [...links];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    const updated = reordered.map((l, i) => ({ ...l, position: i }));
    setLinks(updated);

    debouncedSaveOrder(
      updated.map((l) => ({ id: l.id, position: l.position, profile_id: l.profile_id }))
    );
  };

  if (loading) return <PageLoader />;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-medium mb-1">Links</h1>
          <p className="text-sm text-muted">
            Add your links below. Click Save after editing.
          </p>
        </div>
        <Button size="sm" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Add link
        </Button>
      </div>

      {links.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Link2 className="w-10 h-10" />}
            title="No links yet"
            description="Add your WhatsApp, Instagram, website, or any other link."
            action={
              <Button size="sm" onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 mr-1.5" />
                Add your first link
              </Button>
            }
          />
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={links.map((l) => l.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {links.map((link) => (
                <SortableLinkCard
                  key={link.id}
                  link={link}
                  onSave={saveLink}
                  onDelete={deleteLink}
                  onToggle={toggleLink}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {links.length > 0 && (
        <p className="text-xs text-muted mt-4">
          Drag to reorder. Changes are saved when you click Save.
        </p>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-medium mb-2">Add a link</h3>
            <p className="text-xs text-muted mb-4">Choose a link type to add.</p>
            <div className="grid grid-cols-2 gap-3">
              {linkTypes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => addLink(t.value, t.label, '')}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-accent hover:bg-accent/5 transition-all duration-200 text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                    {t.icon}
                  </div>
                  <span className="text-sm font-medium">{t.label}</span>
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
