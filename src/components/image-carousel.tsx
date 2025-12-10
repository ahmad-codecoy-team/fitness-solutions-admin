import { Icon } from "@/components/icon";
import { getImageUrl } from "@/utils/image";
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from "react";

interface ImageCarouselProps {
	images: string[];
	alt: string;
	className?: string;
}

export function ImageCarousel({ images, alt, className = "" }: ImageCarouselProps) {
	const [emblaRef, emblaApi] = useEmblaCarousel();
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

	const scrollPrev = useCallback(() => {
		if (emblaApi) emblaApi.scrollPrev();
	}, [emblaApi]);

	const scrollNext = useCallback(() => {
		if (emblaApi) emblaApi.scrollNext();
	}, [emblaApi]);

	const scrollTo = useCallback((index: number) => {
		if (emblaApi) emblaApi.scrollTo(index);
	}, [emblaApi]);

	const onInit = useCallback((emblaApi: any) => {
		setScrollSnaps(emblaApi.scrollSnapList());
	}, []);

	const onSelect = useCallback((emblaApi: any) => {
		setSelectedIndex(emblaApi.selectedScrollSnap());
	}, []);

	useEffect(() => {
		if (!emblaApi) return;

		onInit(emblaApi);
		onSelect(emblaApi);
		emblaApi.on('reInit', onInit);
		emblaApi.on('select', onSelect);
	}, [emblaApi, onInit, onSelect]);

	// If only one image, show it without carousel
	if (images.length === 1) {
		return (
			<div className={`aspect-video bg-gray-100 dark:bg-gray-800 relative overflow-hidden ${className}`}>
				<img
					src={getImageUrl(images[0]) || ""}
					alt={alt}
					className="w-full h-full object-cover"
					onError={(e) => {
						e.currentTarget.src = "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop";
					}}
				/>
			</div>
		);
	}

	return (
		<div className={`relative ${className}`}>
			{/* Main Carousel */}
			<div className="embla overflow-hidden" ref={emblaRef}>
				<div className="embla__container flex">
					{images.map((image, index) => (
						<div key={index} className="embla__slide flex-none w-full">
							<div className="aspect-video bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
								<img
									src={getImageUrl(image) || ""}
									alt={`${alt} - Image ${index + 1}`}
									className="w-full h-full object-cover"
									onError={(e) => {
										e.currentTarget.src = "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop";
									}}
								/>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Navigation Arrows */}
			{images.length > 1 && (
				<>
					<button
						type="button"
						className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors z-10"
						onClick={scrollPrev}
					>
						<Icon icon="solar:arrow-left-bold" size={16} />
					</button>
					<button
						type="button"
						className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors z-10"
						onClick={scrollNext}
					>
						<Icon icon="solar:arrow-right-bold" size={16} />
					</button>
				</>
			)}

			{/* Dots Indicator */}
			{images.length > 1 && (
				<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
					{scrollSnaps.map((_, index) => (
						<button
							key={index}
							type="button"
							className={`w-2 h-2 rounded-full transition-colors ${
								index === selectedIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
							}`}
							onClick={() => scrollTo(index)}
						/>
					))}
				</div>
			)}

			{/* Image Counter */}
			{images.length > 1 && (
				<div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-2 py-1 rounded z-10">
					{selectedIndex + 1} / {images.length}
				</div>
			)}
		</div>
	);
}