// Helpers for hydrating and persisting Create Experience flow data to localStorage
export function hydrateStepOne(setStepOneData: (arg: any) => void) {
  try {
    const saved = localStorage.getItem('stepOneFormData');
    if (!saved) return;
    const parsed = JSON.parse(saved);
    if (parsed && typeof parsed === 'object') {
      // Normalize images: allow either array of strings or array of {id,url}
      if (parsed.images && Array.isArray(parsed.images)) {
        parsed.images = parsed.images.map((i: any, n: number) => {
          if (!i) return null;
          if (typeof i === 'string') return { id: `img-${n}-${Date.now()}`, url: i };
          if (typeof i === 'object') return { id: i.id || `img-${n}-${Date.now()}`, url: i.url || i.path || i.src };
          return null;
        }).filter(Boolean);
      }
      setStepOneData((prev: any) => ({ ...prev, ...parsed }));
    }
  } catch (e) {
    //.warn('hydrateStepOne: failed to read/parse stepOneFormData', e);
  }
}

export function persistStepOne(stepOneData: any) {
  try {
    // If the experience has been created and we saved ids, avoid persisting the full step data here.
    const existingIds = localStorage.getItem('experience_ids');
    if (existingIds) {
      // Do not persist individual product fields once the canonical server record exists
      return;
    }
    // Only persist safe, serializable fields. Images are saved as {id,url} objects and any File references are excluded.
    const toSave = {
      productName: stepOneData.productName,
      tagline: stepOneData.tagline,
      category: stepOneData.category,
      storeLink: stepOneData.storeLink,
      estimatedDurationDays: stepOneData.estimatedDurationDays,
      images: Array.isArray(stepOneData.images)
        ? stepOneData.images.map((img: any, n: number) => {
            // prefer existing id; if missing create a stable-ish id
            const id = img && img.id ? img.id : `img-${n}-${(img && img.url) ? hashCode(String(img.url)) : Date.now()}`;
            return { id, url: img && img.url ? img.url : undefined };
          }).filter((i: any) => i && i.url)
        : [],
    };
    localStorage.setItem('stepOneFormData', JSON.stringify(toSave));
  } catch (e) {
    //console.warn('persistStepOne: failed to persist stepOneFormData', e);
  }
}

// Small helper to produce a simple hash from a string for id stability
function hashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function persistStepTwo(stepTwoData: any) {
  try {
    localStorage.setItem('stepTwoData', JSON.stringify(stepTwoData || {}));
  } catch (e) {
   // console.warn('persistStepTwo: failed to persist stepTwoData', e);
  }
}

export default {
  hydrateStepOne,
  persistStepOne,
  persistStepTwo,
};
