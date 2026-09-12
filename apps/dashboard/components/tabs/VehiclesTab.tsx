"use client";

import { useState } from "react";
import {
  Truck,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  X,
  Loader2,
  Users,
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
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import {
  useVehicles,
  useCreateVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
  useReorderVehicle,
  useProfile,
} from "@/hooks";
import { useToast } from "@/providers/toastProvider";
import type { VehicleRecord } from "@repo/db-config";

interface SortableVehicleRowProps {
  vehicle: VehicleRecord;
  idx: number;
  total: number;
  isAdmin: boolean;
  onEdit: (v: VehicleRecord) => void;
  onDelete: (id: number, title: string) => void;
  onMoveOrder: (v: VehicleRecord, direction: "up" | "down") => void;
  isPending: boolean;
}

function SortableVehicleRow({
  vehicle: v,
  idx,
  total,
  isAdmin,
  onEdit,
  onDelete,
  onMoveOrder,
  isPending,
}: SortableVehicleRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: v.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`transition-colors select-none ${
        isDragging
          ? "bg-blue-50/80 shadow-lg scale-[1.01] z-30 opacity-90 relative rounded-xl"
          : "hover:bg-slate-50/70"
      }`}
    >
      <td className="py-3 px-4 font-bold text-slate-700">
        <div className="flex items-center gap-2">
          {/* Drag Handle */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-grab active:cursor-grabbing transition-colors touch-none"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </button>

          <span className="w-6 font-bold text-slate-800 text-xs">
            #{v.displayOrder}
          </span>

          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => onMoveOrder(v, "up")}
              disabled={idx === 0 || isPending}
              className="p-0.5 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-20 cursor-pointer"
              title="Move Up"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
            <button
              onClick={() => onMoveOrder(v, "down")}
              disabled={idx === total - 1 || isPending}
              className="p-0.5 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-20 cursor-pointer"
              title="Move Down"
            >
              <ArrowDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </td>

      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          {v.image ? (
            <img
              src={v.image}
              alt={v.title}
              className="w-10 h-10 rounded-xl object-cover shadow-xs shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
          )}
          <div>
            <p className="font-bold text-slate-800 text-xs">{v.title}</p>
            <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
              {v.description || "No description provided"}
            </p>
          </div>
        </div>
      </td>

      <td className="py-3 px-4">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px]">
          <Users className="w-3 h-3" />
          {v.seatingCapacity ? `${v.seatingCapacity} Seater` : "Flexible"}
        </span>
      </td>

      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1 max-w-xs">
          {Array.isArray(v.features) ? (
            v.features.map((f, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold"
              >
                {String(f)}
              </span>
            ))
          ) : (
            <span className="text-slate-400 text-[11px]">—</span>
          )}
        </div>
      </td>

      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => onEdit(v)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
            title="Edit Vehicle"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          {isAdmin && (
            <button
              onClick={() => onDelete(v.id, v.title)}
              disabled={isPending}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Delete Vehicle (Admin Only)"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export function VehiclesTab() {
  const { data: profile } = useProfile();
  const isAdmin = profile?.role === "ADMIN";
  const { data: vehiclesData, isLoading } = useVehicles();
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const deleteVehicle = useDeleteVehicle();
  const reorderVehicle = useReorderVehicle();
  const { toast } = useToast();

  const vehicles = vehiclesData?.vehicles || [];

  // dnd-kit sensors: Pointer constraint prevents intercepting button clicks
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

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleRecord | null>(
    null
  );

  // Form Fields
  const [title, setTitle] = useState("");
  const [seatingCapacity, setSeatingCapacity] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const openCreateModal = () => {
    setEditingVehicle(null);
    setTitle("");
    setSeatingCapacity("");
    setDescription("");
    setFeatures("");
    setImageFile(null);
    setImageUrl("");
    setIsModalOpen(true);
  };

  const openEditModal = (v: VehicleRecord) => {
    setEditingVehicle(v);
    setTitle(v.title);
    setSeatingCapacity(v.seatingCapacity ? String(v.seatingCapacity) : "");
    setDescription(v.description || "");
    setFeatures(
      Array.isArray(v.features)
        ? v.features.join(", ")
        : typeof v.features === "string"
        ? v.features
        : ""
    );
    setImageFile(null);
    setImageUrl(v.image || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVehicle(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    if (seatingCapacity) formData.append("seatingCapacity", seatingCapacity);
    if (description) formData.append("description", description);

    const featuresList = features
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
    if (featuresList.length > 0) {
      formData.append("features", JSON.stringify(featuresList));
    }

    if (imageFile) {
      formData.append("image", imageFile);
    } else if (imageUrl) {
      formData.append("image", imageUrl);
    }

    try {
      if (editingVehicle) {
        await updateVehicle.mutateAsync({
          id: editingVehicle.id,
          payload: formData,
        });
        toast.success(`Vehicle "${title}" updated successfully!`, "Fleet Updated");
      } else {
        await createVehicle.mutateAsync(formData);
        toast.success(`Vehicle "${title}" added to fleet!`, "Fleet Item Added");
      }
      closeModal();
    } catch (err) {
      toast.error(err, "Vehicle Error");
    }
  };

  const handleDelete = async (id: number, vehicleTitle: string) => {
    if (!confirm(`Are you sure you want to remove "${vehicleTitle}"?`)) return;
    try {
      await deleteVehicle.mutateAsync(id);
      toast.success(
        `Vehicle "${vehicleTitle}" deleted successfully.`,
        "Vehicle Removed"
      );
    } catch (err) {
      toast.error(err, "Delete Failed");
    }
  };

  const handleMoveOrder = async (
    vehicle: VehicleRecord,
    direction: "up" | "down"
  ) => {
    const currentIndex = vehicles.findIndex((v) => v.id === vehicle.id);
    if (currentIndex === -1) return;

    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= vehicles.length) return;

    const targetVehicle = vehicles[targetIndex];
    if (!targetVehicle) return;

    try {
      await reorderVehicle.mutateAsync({
        id: vehicle.id,
        displayOrder: targetVehicle.displayOrder,
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

    const oldIndex = vehicles.findIndex(
      (item) => item.id === Number(active.id)
    );
    const newIndex = vehicles.findIndex(
      (item) => item.id === Number(over.id)
    );
    if (oldIndex === -1 || newIndex === -1) return;

    const targetVehicle = vehicles[newIndex];
    if (!targetVehicle) return;

    try {
      await reorderVehicle.mutateAsync({
        id: Number(active.id),
        displayOrder: targetVehicle.displayOrder,
      });
      toast.success("Fleet display order updated!", "Reordered");
    } catch (err) {
      toast.error(err, "Reorder Failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Add Button */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">
            Vehicles Fleet Management
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Manage listings, seating capacities, features, and drag to reorder positions.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-gradient-to-tl from-blue-600 to-cyan-400 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 hover:opacity-95 transition-opacity flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Vehicles Table with Drag and Drop */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : vehicles.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">
              No Vehicles Listed
            </h4>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Add Tempo Travellers, Force Urbania, or luxury buses to your fleet.
            </p>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-gradient-to-tl from-blue-600 to-cyan-400 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              Add First Vehicle
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
              onDragEnd={handleDragEnd}
            >
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Order / Drag</th>
                    <th className="py-3 px-4">Vehicle</th>
                    <th className="py-3 px-4">Seating</th>
                    <th className="py-3 px-4">Features</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <SortableContext
                  items={vehicles.map((v) => v.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <tbody className="divide-y divide-slate-100">
                    {vehicles.map((v, idx) => (
                      <SortableVehicleRow
                        key={v.id}
                        vehicle={v}
                        idx={idx}
                        total={vehicles.length}
                        isAdmin={isAdmin}
                        onEdit={openEditModal}
                        onDelete={handleDelete}
                        onMoveOrder={handleMoveOrder}
                        isPending={reorderVehicle.isPending}
                      />
                    ))}
                  </tbody>
                </SortableContext>
              </table>
            </DndContext>
          </div>
        )}
      </div>

      {/* Add / Edit Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0">
              <h4 className="text-sm font-bold text-slate-800">
                {editingVehicle ? "Edit Vehicle Listing" : "Add Vehicle Listing"}
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
                  Vehicle Name / Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 12 Seater Luxury Tempo Traveller"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Seating Capacity (e.g. 12)
                </label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={seatingCapacity}
                  onChange={(e) => setSeatingCapacity(e.target.value)}
                  placeholder="12"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Features (comma-separated)
                </label>
                <input
                  type="text"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="AC, Pushback Seats, USB Charger, Music System"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief overview of amenities and comfort..."
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Vehicle Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
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
                  disabled={createVehicle.isPending || updateVehicle.isPending}
                  className="px-4 py-1.5 bg-gradient-to-tl from-blue-600 to-cyan-400 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {(createVehicle.isPending || updateVehicle.isPending) && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  <span>{editingVehicle ? "Update Vehicle" : "Create Vehicle"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
