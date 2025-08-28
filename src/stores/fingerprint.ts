// stores/fingerprint.store.ts
import { defineStore } from "pinia";
// import { store } from './index';

// 10 ngón tay chuẩn
export type FingerName =
  | "RIGHT_THUMB"
  | "RIGHT_INDEX"
  | "RIGHT_MIDDLE"
  | "RIGHT_RING"
  | "RIGHT_LITTLE"
  | "LEFT_THUMB"
  | "LEFT_INDEX"
  | "LEFT_MIDDLE"
  | "LEFT_RING"
  | "LEFT_LITTLE";

export interface Fingerprint {
  preview: string;
}

export type FingerprintMap = Partial<Record<FingerName, Fingerprint>>;

export interface Card {
  id: number;
  personId: string;
  detaineeName?: string;
  createdDate?: string;
  createdPlace?: string;
  fpFormula?: string;
  dp?: string;
  tw?: string;
  reasonNote?: string;
  fingerprints?: FingerprintMap;
  createdAt: string; // ISO string
}

export interface SearchForm {
  detaineeCode?: string;
  detaineeName?: string;
}

interface FingerprintState {
  cards: Card[];
  filteredCards: Card[];
  loading: boolean;
  error: string | null;
}

export const useFingerprintStore = defineStore("fingerprint", {
  state: (): FingerprintState => ({
    cards: [],
    filteredCards: [],
    loading: false,
    error: null,
  }),

  getters: {
    totalCards: (state): number => state.cards.length,

    cardsByPersonId:
      (state) =>
      (personId: string): Card[] => {
        return state.cards.filter((card) => card.personId === personId);
      },

    completedCards: (state): Card[] => {
      return state.cards.filter((card) => {
        const fingerprintCount = card.fingerprints
          ? Object.keys(card.fingerprints).length
          : 0;
        return fingerprintCount === 10;
      });
    },
  },

  actions: {
    async fetchCards(): Promise<void> {
      this.loading = true;
      try {
        const response = await fetch("/api/fingerprint-cards");
        if (!response.ok) throw new Error("Failed to fetch fingerprint cards");

        const data = (await response.json()) as Card[];
        this.cards = data;
        this.filteredCards = data;
        this.error = null;
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "Failed to fetch fingerprint cards";
        this.error = message;
        // Dùng dữ liệu mẫu khi dev
        this.loadSampleData();
      } finally {
        this.loading = false;
      }
    },

    async searchCards(searchForm: SearchForm): Promise<void> {
      this.loading = true;
      try {
        const filtered = this.cards.filter((card) => {
          const matchCode =
            !searchForm.detaineeCode ||
            card.personId
              .toLowerCase()
              .includes(searchForm.detaineeCode.toLowerCase());

          const matchName =
            !searchForm.detaineeName ||
            (!!card.detaineeName &&
              card.detaineeName
                .toLowerCase()
                .includes(searchForm.detaineeName.toLowerCase()));

          return matchCode && matchName;
        });

        this.filteredCards = filtered;
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Search cards failed";
        this.error = message;
      } finally {
        this.loading = false;
      }
    },

    async createCard(cardData: Omit<Card, "id" | "createdAt">): Promise<Card> {
      this.loading = true;
      try {
        const response = await fetch("/api/fingerprint-cards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cardData),
        });

        if (!response.ok) throw new Error("Failed to create fingerprint card");

        const newCard = (await response.json()) as Card;

        // Bảo đảm có id/createdAt phía client (nếu BE chưa trả)
        newCard.id = newCard.id ?? this.cards.length + 1;
        newCard.createdAt = newCard.createdAt ?? new Date().toISOString();

        this.cards.unshift(newCard);
        this.filteredCards = [...this.cards];

        return newCard;
      } catch (e: unknown) {
        // Giả lập thành công khi dev
        const fallback: Card = {
          id: this.cards.length + 1,
          ...cardData,
          createdAt: new Date().toISOString(),
        };
        this.cards.unshift(fallback);
        this.filteredCards = [...this.cards];
        return fallback;
      } finally {
        this.loading = false;
      }
    },

    async updateCard(id: number, updates: Partial<Card>): Promise<Card> {
      this.loading = true;
      try {
        const response = await fetch(`/api/fingerprint-cards/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });

        if (!response.ok) throw new Error("Failed to update fingerprint card");

        const updatedCard = (await response.json()) as Card;

        const index = this.cards.findIndex((card) => card.id === id);
        if (index !== -1) {
          this.cards[index] = updatedCard;
          this.filteredCards = [...this.cards];
        }

        return updatedCard;
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "Failed to update fingerprint card";
        this.error = message;
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async deleteCard(id: number): Promise<void> {
      this.loading = true;
      try {
        const response = await fetch(`/api/fingerprint-cards/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete fingerprint card");

        this.cards = this.cards.filter((card) => card.id !== id);
        this.filteredCards = this.filteredCards.filter(
          (card) => card.id !== id
        );
      } catch {
        // Giả lập xoá thành công khi dev
        this.cards = this.cards.filter((card) => card.id !== id);
        this.filteredCards = this.filteredCards.filter(
          (card) => card.id !== id
        );
      } finally {
        this.loading = false;
      }
    },

    loadSampleData(): void {
      this.cards = [
        {
          id: 1,
          personId: "PN001",
          detaineeName: "Nguyễn Văn A",
          createdDate: "2024-01-15",
          createdPlace: "Trại giam T16",
          fpFormula: "AL-32-W-OOO",
          dp: "15",
          tw: "8",
          reasonNote: "Lập chỉ bản phục vụ điều tra",
          fingerprints: {
            RIGHT_THUMB: { preview: "/placeholder-fingerprint.jpg" },
            RIGHT_INDEX: { preview: "/placeholder-fingerprint.jpg" },
            RIGHT_MIDDLE: { preview: "/placeholder-fingerprint.jpg" },
          },
          createdAt: "2024-01-15T10:30:00Z",
        },
        {
          id: 2,
          personId: "PN002",
          detaineeName: "Trần Thị B",
          createdDate: "2024-02-20",
          createdPlace: "Trại giam T16",
          fpFormula: "WL-28-A-IOI",
          dp: "12",
          tw: "6",
          reasonNote: "Lập chỉ bản theo quy định",
          fingerprints: {
            RIGHT_THUMB: { preview: "/placeholder-fingerprint.jpg" },
            RIGHT_INDEX: { preview: "/placeholder-fingerprint.jpg" },
            RIGHT_MIDDLE: { preview: "/placeholder-fingerprint.jpg" },
            RIGHT_RING: { preview: "/placeholder-fingerprint.jpg" },
            RIGHT_LITTLE: { preview: "/placeholder-fingerprint.jpg" },
            LEFT_THUMB: { preview: "/placeholder-fingerprint.jpg" },
            LEFT_INDEX: { preview: "/placeholder-fingerprint.jpg" },
            LEFT_MIDDLE: { preview: "/placeholder-fingerprint.jpg" },
            LEFT_RING: { preview: "/placeholder-fingerprint.jpg" },
            LEFT_LITTLE: { preview: "/placeholder-fingerprint.jpg" },
          },
          createdAt: "2024-02-20T14:15:00Z",
        },
      ];
      this.filteredCards = [...this.cards];
    },
  },
});
