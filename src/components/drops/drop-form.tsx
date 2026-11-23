import type { Category, Drop } from "@/lib/api/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationField } from "./location-field";

const inputClass = "w-full rounded-lg border border-zinc-400 bg-white px-3 py-2 focus-visible:outline-2 focus-visible:outline-blue-700 dark:border-zinc-600 dark:bg-zinc-950";

export function DropFields({ categories, drop }: { categories: Category[]; drop?: Drop }) {
  const categoryLabels = categories.map(({ id, label }) => ({
    value: id,
    label,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="drop-title" className="block font-medium">Titre</label>
        <input id="drop-title" name="title" required minLength={3} maxLength={80} defaultValue={drop?.title} className={inputClass} />
      </div>
      <div>
        <label htmlFor="drop-content" className="block font-medium">Message</label>
        <textarea id="drop-content" name="content" required maxLength={1000} rows={5} defaultValue={drop?.content ?? ""} className={inputClass} />
      </div>
      <div>
        <label htmlFor="drop-category" className="block font-medium">Catégorie</label>
        {/* <select id="drop-category" name="category" required defaultValue={drop?.category ?? ""} className={inputClass}>
          <option value="">{categories.length ? "Choisir une catégorie" : "Aucune catégorie disponible"}</option>
          {categories.map(({ id, label }) => (
            <option key={id} value={id}>{label}</option>
          ))}
        </select> */}
        <Select name="category" required defaultValue={drop?.category ?? null} items={categoryLabels}>
          <SelectTrigger id="drop-category" className={inputClass + " dark:hover:bg-zinc-900 data-[size=default]:h-10"}>
            <SelectValue placeholder={categories.length ? "Choisir une catégorie" : "Aucune catégorie disponible"} />
          </SelectTrigger>
          <SelectContent align="start" alignItemWithTrigger={false}>
            <SelectGroup>
              {categoryLabels.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label htmlFor="drop-image" className="block font-medium">URL de l’image</label>
        <input id="drop-image" name="imageUrl" type="url" maxLength={500} defaultValue={drop?.imageUrl ?? ""} placeholder="https://" aria-describedby="drop-image-description" className={inputClass} />
        <p id="drop-image-description" className="text-sm text-zinc-600 dark:text-zinc-300">Obligatoire pour la catégorie Photo.</p>
      </div>
      <fieldset>
        <legend className="font-medium">Position du drop</legend>
        <LocationField
          initialLat={drop?.location.lat}
          initialLng={drop?.location.lng}
          showTestPosition={!drop}
        />
      </fieldset>
    </div>
  );
}
