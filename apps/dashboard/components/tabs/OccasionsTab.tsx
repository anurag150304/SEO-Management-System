"use client";

import { useState } from "react";
import {
  PartyPopper,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  X,
  Loader2,
  GripVertical,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {
  useOccasions,
  useCreateOccasion,
  useUpdateOccasion,
  useDeleteOccasion,
  useReorderOccasion,
  useProfile,
} from "@/hooks";
import { useToast } from "@/providers/toastProvider";
import type { OccasionRecord } from "@repo/db-config";

interface SortableOccasionCardProps {
  occasion: OccasionRecord;
  idx: number;
  total: number;
  isAdmin: boolean;
  onEdit: (occ: OccasionRecord) => void;
  onDelete: (id: number, title: string) => void;
  onMoveOrder: (occ: OccasionRecord, direction: "up" | "down") => void;
  isPending: boolean;
}

function SortableOccasionCard({
  occasion: occ,
  idx,
  total,
  isAdmin,
  onEdit,
  onDelete,
  onMoveOrder,
  isPending,
}: SortableOccasionCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: occ.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col justify-between transition-all select-none ${
        isDragging
          ? "shadow-2xl scale-[1.03] z-30 opacity-90 ring-2 ring-purple-500/40 relative"
          : "hover:shadow-md"
      }`}
    >
      <div>
        <div className="relative h-40 bg-slate-100 overflow-hidden">
          {occ.image ? (
            <img
              src={occ.image}
              alt={occ.title}
              className="w-full h-full object-cover pointer-events-none"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <PartyPopper className="w-12 h-12" />
            </div>
          )}
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold">
            #{occ.displayOrder}
          </div>

          {/* Drag Handle Top-Right */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="absolute top-3 right-3 p-1 rounded-lg bg-white/90 hover:bg-white text-slate-600 shadow-sm cursor-grab active:cursor-grabbing transition-transform touch-none"
            title="Drag to reorder occasion"
          >
            <GripVertical className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4">
          <h4 className="text-sm font-bold text-slate-800 line-clamp-1">
            {occ.title}
          </h4>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {occ.description || "No description provided."}
          </p>
        </div>
      </div>

      <div className="p-4 pt-0 border-t border-slate-100 mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onMoveOrder(occ, "up")}
            disabled={idx === 0 || isPending}
            className="p-1 rounded text-slate-400 hover:text-purple-600 hover:bg-purple-50 disabled:opacity-20 cursor-pointer"
            title="Move Up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onMoveOrder(occ, "down")}
            disabled={idx === total - 1 || isPending}
            className="p-1 rounded text-slate-400 hover:text-purple-600 hover:bg-purple-50 disabled:opacity-20 cursor-pointer"
            title="Move Down"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(occ)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
            title="Edit Occasion"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          {isAdmin && (
            <button
              onClick={() => onDelete(occ.id, occ.title)}
              disabled={isPending}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Delete Occasion (Admin Only)"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function OccasionsTab() {
  const { data: profile } = useProfile();
  const isAdmin = profile?.role === "ADMIN";
  const { data: occasionsData, isLoading } = useOccasions();
  const createOccasion = useCreateOccasion();
  const updateOccasion = useUpdateOccasion();
  const deleteOccasion = useDeleteOccasion();
  const reorderOccasion = useReorderOccasion();
  const { toast } = useToast();

  const occasions = occasionsData?.occasions || [];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOccasion, setEditingOccasion] =
    useState<OccasionRecord | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const openCreateModal = () => {
    setEditingOccasion(null);
    setTitle("");
    setDescription("");
    setImageFile(null);
    setImageUrl("");
    setIsModalOpen(true);
  };

  const openEditModal = (occ: OccasionRecord) => {
    setEditingOccasion(occ);
    setTitle(occ.title);
    setDescription(occ.description || "");
    setImageFile(null);
    setImageUrl(occ.image || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingOccasion(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    if (description) formData.append("description", description);

    if (imageFile) {
      formData.append("image", imageFile);
    } else if (imageUrl) {
      formData.append("image", imageUrl);
    }

    try {
      if (editingOccasion) {
        await updateOccasion.mutateAsync({
          id: editingOccasion.id,
          payload: formData,
        });
        toast.success(`Occasion "${title}" updated successfully!`, "Occasion Updated");
      } else {
        await createOccasion.mutateAsync(formData);
        toast.success(`Occasion "${title}" added!`, "Occasion Created");
      }
      closeModal();
    } catch (err) {
      toast.error(err, "Occasion Error");
    }
  };

  const handleDelete = async (id: number, occasionTitle: string) => {
    if (!confirm(`Are you sure you want to remove "${occasionTitle}"?`)) return;
    try {
      await deleteOccasion.mutateAsync(id);
      toast.success(`Occasion "${occasionTitle}" deleted successfully.`, "Occasion Removed");
    } catch (err) {
      toast.error(err, "Delete Failed");
    }
  };

  const handleMoveOrder = async (
    occ: OccasionRecord,
    direction: "up" | "down"
  ) => {
    const currentIndex = occasions.findIndex((o) => o.id === occ.id);
    if (currentIndex === -1) return;

    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= occasions.length) return;

    const targetOccasion = occasions[targetIndex];
    if (!targetOccasion) return;

    try {
      await reorderOccasion.mutateAsync({
        id: occ.id,
        displayOrder: targetOccasion.displayOrder,
      });
      toast.success(
        `Position moved ${direction} successfully!`,
        "Order Updated"
      );
    } catch (err) {
      toast.error(err, "Reorder Failed");
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = occasions.findIndex(
      (item) => item.id === Number(active.id)
    );
    const newIndex = occasions.findIndex(
      (item) => item.id === Number(over.id)
    );
    if (oldIndex === -1 || newIndex === -1) return;

    const targetOccasion = occasions[newIndex];
    if (!targetOccasion) return;

    try {
      await reorderOccasion.mutateAsync({
        id: Number(active.id),
        displayOrder: targetOccasion.displayOrder,
      });
      toast.success("Occasion display order updated!", "Reordered");
    } catch (err) {
      toast.error(err, "Reorder Failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">
            Travel Occasions Management
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Manage event categories and drag cards to reorder display sequence.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-gradient-to-tl from-purple-600 to-indigo-400 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/25 hover:opacity-95 transition-opacity flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Occasion</span>
        </button>
      </div>

      {/* Occasions Grid with Drag and Drop */}
      {isLoading ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      ) : occasions.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
            <PartyPopper className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">
            No Occasions Configured
          </h4>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Create travel packages like Weddings, Outstation Trips, or Corporate Events.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-gradient-to-tl from-purple-600 to-indigo-400 text-white rounded-xl text-xs font-bold shadow-sm"
          >
            Create First Occasion
          </button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToParentElement]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={occasions.map((o) => o.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {occasions.map((occ, idx) => (
                <SortableOccasionCard
                  key={occ.id}
                  occasion={occ}
                  idx={idx}
                  total={occasions.length}
                  isAdmin={isAdmin}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                  onMoveOrder={handleMoveOrder}
                  isPending={reorderOccasion.isPending}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Add / Edit Occasion Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0">
              <h4 className="text-sm font-bold text-slate-800">
                {editingOccasion ? "Edit Occasion" : "Add Occasion Category"}
              </h4>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-4 space-y-3.5 overflow-y-auto flex-1"
            >
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Occasion Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Wedding Transportation"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Event details and transportation arrangements..."
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Featured Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                />
                {imageUrl && !imageFile && (
                  <p className="text-[10px] text-slate-400 mt-1 truncate">
                    Current: {imageUrl}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createOccasion.isPending || updateOccasion.isPending}
                  className="px-4 py-1.5 bg-gradient-to-tl from-purple-600 to-indigo-400 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {(createOccasion.isPending || updateOccasion.isPending) && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  <span>{editingOccasion ? "Update" : "Create"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
