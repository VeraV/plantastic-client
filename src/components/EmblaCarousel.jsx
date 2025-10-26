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
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide) => (
            <div className="embla__slide" key={slide._id}>
              {/*<div className="embla__slide__number">{slide.name}</div>*/}
              <div className="recipe-card">
                <h4>{slide.name}</h4>
                <img src={slide.image} alt={slide.name} />
                <p>{slide.duration} mins to cook</p>
                <button
                  onClick={(e) => {
                    handleAddRecipe(e, slide._id);
                  }}
                >
                  + To the Plan!!
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;
