'use client';

import { useEffect, useState, useCallback } from 'react';
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
import { GripVertical, Plus, Trash2, Link2, Phone, MessageCircle, Instagram, MapPin, Mail, Globe, Eye, EyeOff, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import type { Link as LinkType, LinkType as LinkTypeEnum, Profile } from '@/lib/types';

const linkTypes: { value: LinkTypeEnum; label: string; icon: React.ReactNode }[] = [
  { value: 'url', label: 'URL', icon: <Globe className="w-4 h-4" /> },
  { value: 'phone', label: 'Phone', icon: <Phone className="w-4 h-4" /> },
  { value: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="w-4 h-4" /> },
  { value: 'instagram', label: 'Instagram', icon: <Instagram className="w-4 h-4" /> },
  { value: 'maps', label: 'Google Maps', icon: <MapPin className="w-4 h-4" /> },
  { value: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
  { value: 'custom', label: 'Custom', icon: <Link2 className="w-4 h-4" /> },
];

function SortableLinkCard({
  link,
  onUpdate,
  onDelete,
  onToggle,
}: {
  link: LinkType;
  onUpdate: (id: string, data: Partial<LinkType>) => void;
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

  const formatUrl = (type: LinkTypeEnum, value: string) => {
    switch (type) {
      case 'whatsapp':
        const cleaned = value.replace(/\D/g, '');
        return `https://wa.me/${cleaned}`;
      case 'phone':
        return `tel:${value.replace(/\s/g, '')}`;
      case 'email':
        return `mailto:${value}`;
      case 'instagram':
        return value.startsWith('http') ? value : `https://instagram.com/${value.replace('@', '')}`;
      case 'maps':
        return value.startsWith('http') ? value : `https://maps.google.com/?q=${encodeURIComponent(value)}`;
      default:
        return value;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3"
    >
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

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <select
            value={link.type}
            onChange={(e) => {
              const newType = e.target.value as LinkTypeEnum;
              onUpdate(link.id, { type: newType, url: '', icon: null });
            }}
            className="text-xs font-medium bg-transparent border border-border rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-accent"
          >
            {linkTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => onToggle(link.id)}
            className="text-muted/40 hover:text-muted transition-colors"
          >
            {link.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => onDelete(link.id)}
            className="text-muted/40 hover:text-red-500 transition-colors ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Label"
            value={link.label}
            onChange={(e) => onUpdate(link.id, { label: e.target.value })}
            className="text-sm !py-1.5"
          />
          <Input
            placeholder={link.type === 'whatsapp' ? 'Phone number' : 'URL'}
            value={link.url}
            onChange={(e) =>
              onUpdate(link.id, { url: formatUrl(link.type, e.target.value) })
            }
            className="text-sm !py-1.5"
          />
        </div>
      </div>
    </div>
  );
}

export default function LinksEditorPage() {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const supabase = createClient();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setProfileId(user.id);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', user.id)
        .single();

      setIsPro(profileData?.subscription_tier === 'pro');

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

  const atLimit = !isPro && links.length >= 5;

  const addLink = async (type: LinkTypeEnum = 'url', label = 'New Link', url = '') => {
    if (!profileId) return;
    if (atLimit) {
      toast.error('Free plan limited to 5 links. Upgrade to Pro for unlimited.');
      return;
    }
    const position = links.length;

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
    toast.success('Link added');
  };

  const updateLink = async (id: string, data: Partial<LinkType>) => {
    setLinks(links.map((l) => (l.id === id ? { ...l, ...data } : l)));

    const { error } = await supabase
      .from('links')
      .update(data)
      .eq('id', id);

    if (error) toast.error(error.message);
  };

  const deleteLink = async (id: string) => {
    setLinks(links.filter((l) => l.id !== id));

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

    await updateLink(id, { is_active: !link.is_active });
  };

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

    const { error } = await supabase.from('links').upsert(
      updated.map((l) => ({ id: l.id, position: l.position, profile_id: l.profile_id }))
    );

    if (error) toast.error('Failed to save order');
  };

  if (loading) return <PageLoader />;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-medium mb-1">Links</h1>
          <p className="text-sm text-muted">
            Add, edit, and reorder your links.
          </p>
        </div>
        {atLimit ? (
          <Link href="/pricing">
            <Button size="sm">
              <Lock className="w-3.5 h-3.5 mr-1.5" />
              Upgrade
            </Button>
          </Link>
        ) : (
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add link
          </Button>
        )}
      </div>

      {links.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Link2 className="w-10 h-10" />}
            title="No links yet"
            description="Add your first link to get started."
            action={
              <Button size="sm" onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 mr-1.5" />
                Add link
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
                  onUpdate={updateLink}
                  onDelete={deleteLink}
                  onToggle={toggleLink}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <p className="text-xs text-muted mt-4">
        {!isPro && `Free plan: ${links.length}/5 links used.`} Drag to reorder.
      </p>

      {/* Add link type selector modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-medium mb-4">Add a link</h3>
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
