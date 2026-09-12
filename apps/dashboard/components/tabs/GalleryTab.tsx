"use client";

import { useState } from "react";
import {
  Image as ImageIcon,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  X,
  Loader2,
  Tag,
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
  useGallery,
  useCreateGalleryItem,
  useUpdateGalleryItem,
  useDeleteGalleryItem,
  useReorderGalleryItem,
  useProfile,
} from "@/hooks";
import { useToast } from "@/providers/toastProvider";
import type { GalleryRecord } from "@repo/db-config";

interface SortableGalleryCardProps {
  item: GalleryRecord;
  idx: number;
  total: number;
  isAdmin: boolean;
  onEdit: (item: GalleryRecord) => void;
  onDelete: (id: number) => void;
  onMoveOrder: (item: GalleryRecord, direction: "up" | "down") => void;
  isPending: boolean;
}

function SortableGalleryCard({
  item,
  idx,
  total,
  isAdmin,
  onEdit,
  onDelete,
  onMoveOrder,
  isPending,
}: SortableGalleryCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col justify-between transition-all select-none group ${
        isDragging
          ? "shadow-2xl scale-[1.03] z-30 opacity-90 ring-2 ring-rose-500/40 relative"
          : "hover:shadow-md"
      }`}
    >
      <div>
        <div className="relative h-44 bg-slate-100 overflow-hidden">
          <img
            src={item.image}
            alt={item.altText}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
          />
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
            #{item.displayOrder}
          </div>

          {/* Drag Handle Top-Right */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="absolute top-2.5 right-2.5 p-1 rounded-lg bg-white/90 hover:bg-white text-slate-700 shadow-sm cursor-grab active:cursor-grabbing transition-transform touch-none"
            title="Drag to reorder photo"
          >
            <GripVertical className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3.5">
          <div className="flex items-start gap-1.5 text-xs text-slate-700">
            <Tag className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
            <p className="text-[11px] font-medium text-slate-600 line-clamp-2 leading-relaxed">
              {item.altText}
            </p>
          </div>
        </div>
      </div>

      <div className="p-3 pt-0 border-t border-slate-100 mt-1 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onMoveOrder(item, "up")}
            disabled={idx === 0 || isPending}
            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-20 cursor-pointer"
            title="Move Up"
          >
            <ArrowUp className="w-3 h-3" />
          </button>
          <button
            onClick={() => onMoveOrder(item, "down")}
            disabled={idx === total - 1 || isPending}
            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-20 cursor-pointer"
            title="Move Down"
          >
            <ArrowDown className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Edit Alt Tag"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          {isAdmin && (
            <button
              onClick={() => onDelete(item.id)}
              disabled={isPending}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Delete Image (Admin Only)"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function GalleryTab() {
  const { data: profile } = useProfile();
  const isAdmin = profile?.role === "ADMIN";
  const { data: galleryData, isLoading } = useGallery();
  const createGallery = useCreateGalleryItem();
  const updateGallery = useUpdateGalleryItem();
  const deleteGallery = useDeleteGalleryItem();
  const reorderGallery = useReorderGalleryItem();
  const { toast } = useToast();

  const gallery = galleryData?.gallery || [];

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
  const [editingItem, setEditingItem] = useState<GalleryRecord | null>(null);

  const [altText, setAltText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const openCreateModal = () => {
    setEditingItem(null);
    setAltText("");
    setImageFile(null);
    setImageUrl("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: GalleryRecord) => {
    setEditingItem(item);
    setAltText(item.altText);
    setImageFile(null);
    setImageUrl(item.image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("altText", altText);

    if (imageFile) {
      formData.append("image", imageFile);
    } else if (imageUrl) {
      formData.append("image", imageUrl);
    }

    try {
      if (editingItem) {
        await updateGallery.mutateAsync({
          id: editingItem.id,
          payload: formData,
        });
        toast.success("Gallery image updated successfully!", "Gallery Updated");
      } else {
        await createGallery.mutateAsync(formData);
        toast.success("New photo added to gallery!", "Photo Uploaded");
      }
      closeModal();
    } catch (err) {
      toast.error(err, "Gallery Error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this gallery photo?")) return;
    try {
      await deleteGallery.mutateAsync(id);
      toast.success("Gallery image deleted.", "Photo Removed");
    } catch (err) {
      toast.error(err, "Delete Failed");
    }
  };

  const handleMoveOrder = async (
    item: GalleryRecord,
    direction: "up" | "down"
  ) => {
    const currentIndex = gallery.findIndex((g) => g.id === item.id);
    if (currentIndex === -1) return;

    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= gallery.length) return;

    const target = gallery[targetIndex];
    if (!target) return;

    try {
      await reorderGallery.mutateAsync({
        id: item.id,
        displayOrder: target.displayOrder,
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

    const oldIndex = gallery.findIndex(
      (item) => item.id === Number(active.id)
    );
    const newIndex = gallery.findIndex(
      (item) => item.id === Number(over.id)
    );
    if (oldIndex === -1 || newIndex === -1) return;

    const target = gallery[newIndex];
    if (!target) return;

    try {
      await reorderGallery.mutateAsync({
        id: Number(active.id),
        displayOrder: target.displayOrder,
      });
      toast.success("Gallery display order updated!", "Reordered");
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
            Media Gallery & SEO Alt Tags
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Manage high-resolution fleet photos with descriptive alt text, and drag photos to reorder sequence.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-gradient-to-tl from-rose-500 to-pink-400 text-white rounded-xl text-xs font-bold shadow-md shadow-pink-500/25 hover:opacity-95 transition-opacity flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Image</span>
        </button>
      </div>

      {/* Gallery Photo Grid with Drag and Drop */}
      {isLoading ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
        </div>
      ) : gallery.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">
            No Gallery Photos Added
          </h4>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Showcase your fleet exterior, interior, and luxury amenities.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-gradient-to-tl from-rose-500 to-pink-400 text-white rounded-xl text-xs font-bold shadow-sm"
          >
            Upload First Photo
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
            items={gallery.map((g) => g.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {gallery.map((item, idx) => (
                <SortableGalleryCard
                  key={item.id}
                  item={item}
                  idx={idx}
                  total={gallery.length}
                  isAdmin={isAdmin}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                  onMoveOrder={handleMoveOrder}
                  isPending={reorderGallery.isPending}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Upload / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0">
              <h4 className="text-sm font-bold text-slate-800">
                {editingItem ? "Edit Gallery Image" : "Upload Gallery Image"}
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
                  SEO Alt Tag *
                </label>
                <input
                  type="text"
                  required
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="e.g. 16 Seater Force Urbania luxury interior maharaja seats"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Accurate alt text boosts Google Image Search ranking and accessibility.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Image File {editingItem ? "(Optional)" : "*"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required={!editingItem && !imageUrl}
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 cursor-pointer"
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
                  disabled={createGallery.isPending || updateGallery.isPending}
                  className="px-4 py-1.5 bg-gradient-to-tl from-rose-500 to-pink-400 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-500/20 hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {(createGallery.isPending || updateGallery.isPending) && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  <span>{editingItem ? "Update" : "Upload"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
