import React from "react";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import useEmblaCarousel from "embla-carousel-react";

const EmblaCarousel = (props) => {
  const { slides, options, handleAddRecipe } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section className="embla my-5">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide) => (
            <div className="embla__slide" key={slide._id}>
              <div className="card recipe-card shadow-card text-center p-3 h-100 border-0">
                <img
                  src={slide.image}
                  alt={slide.name}
                  className="card-img-top rounded-3 mb-3"
                  style={{ objectFit: "cover", height: "180px" }}
                />

                <div className="card-body p-0">
                  <h5 className="fw-bold text-primary mb-1">{slide.name}</h5>
                  <p className="text-secondary small mb-3">
                    ⏱ {slide.duration} mins to cook
                  </p>
                  <button
                    className="btn btn-success w-100"
                    onClick={(e) => handleAddRecipe(e, slide._id)}
                  >
                    + Add to Plan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls mt-3 text-center">
        <div className="embla__buttons d-inline-flex gap-3">
          <PrevButton
            onClick={onPrevButtonClick}
            disabled={prevBtnDisabled}
            className="btn btn-outline-success rounded-circle px-3"
          />
          <NextButton
            onClick={onNextButtonClick}
            disabled={nextBtnDisabled}
            className="btn btn-outline-success rounded-circle px-3"
          />
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;
