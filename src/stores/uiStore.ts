import { create } from 'zustand';

interface UIStore {
  searchOpen: boolean;
  mobileMenuOpen: boolean;
  ageVerified: boolean;
  quickViewProduct: string | null;
  openSearch: () => void;
  closeSearch: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  setAgeVerified: (verified: boolean) => void;
  openQuickView: (handle: string) => void;
  closeQuickView: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  searchOpen: false,
  mobileMenuOpen: false,
  ageVerified: typeof window !== 'undefined'
    ? localStorage.getItem('vj-age-verified') === 'true'
    : false,
  quickViewProduct: null,

  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
  openMobileMenu: () => set({ mobileMenuOpen: true }),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  setAgeVerified: (verified) => {
    localStorage.setItem('vj-age-verified', String(verified));
    set({ ageVerified: verified });
  },
  openQuickView: (handle) => set({ quickViewProduct: handle }),
  closeQuickView: () => set({ quickViewProduct: null }),
}));
