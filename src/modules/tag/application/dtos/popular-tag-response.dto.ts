import { TagResponseDto } from "./tag-response.dto";

export class PopularTagResponseDto {
    tag: TagResponseDto;
    count: number; // Number of news using this tag
}