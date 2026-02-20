export class CategoryResponseDto {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    color: string | null;
    icon: string | null;
    createdAt: string;
    updatedAt: string;
}