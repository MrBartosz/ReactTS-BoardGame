import { useEffect, useRef, useState } from 'react'
import Card from './Card'
import '../css/board.css'

const images = [
  `https://i.ibb.co/brPjkkV/1.png`,
  `https://i.ibb.co/prmP3qg/2.png`,
  `https://i.ibb.co/qFzw1Td/3.png`,
  `https://i.ibb.co/g67xdBR/4.png`,
  `https://i.ibb.co/6Z98zCb/5.png`,
  `https://i.ibb.co/3BJpWm6/6.png`
];


type BoardProps = {
  setMoves: React.Dispatch<React.SetStateAction<number>>
  finishGameCallback: () => void
  cardIds: Array<number>
}

function Board(props: BoardProps) {
  const [openCards, setOpenCards] = useState<Array<number>>([]);
  const [clearedCards, setClearedCards] = useState<Array<number>>([]);
  const [shouldDisableAllCards, setShouldDisableAllCards] = useState<boolean>(false);


  const disable = () => {
    setShouldDisableAllCards(true);
  };
  const enable = () => {
    setShouldDisableAllCards(false);
  };

  const checkCompletion = () => {
    if (clearedCards.length === props.cardIds.length) {
     props.finishGameCallback()
    }
  }

  const evaluate = () => {
    const [first, second] = openCards;
    enable();

    // check if first card is equal second card
    if ((first % 6 + 1) === (second % 6 + 1)) {
      setClearedCards((prev) => [...prev, first, second]);
      setOpenCards([]);
      return;
    }
    // flip the cards back after 500ms duration
    setTimeout(() => {
      setOpenCards([]);
    }, 500);
  }

  const handleCardClick = (id: number) => {
    if (openCards.length === 1) {

      // in this case we have alredy selected one card
      // this means that we are finishing a move
      setOpenCards((prev) => [...prev, id]);
      props.setMoves((moves) => moves + 1)
      disable();
    } else {

      // in this case this is the first card we select
      setOpenCards([id]);
    }
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (openCards.length === 2) {
      timeout = setTimeout(evaluate, 300);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [openCards]);

  useEffect(() => {
    checkCompletion();
  }, [clearedCards]);

  const checkIsFlipped = (id: number) => {
    return clearedCards.includes(id) || openCards.includes(id);
  };

  const checkIsInactive = (id: number) => {
    return clearedCards.includes(id)
  };

  return (
    <div className={'board'}>
      {props.cardIds.map( (i) => {
        return <Card
          key={i}
          image={`${images[i % 6]}`}
          id={i}
          isDisabled={shouldDisableAllCards}
          isInactive={checkIsInactive(i)}
          isFlipped={checkIsFlipped(i)}
          onClick={handleCardClick}
        />
      })}
    </div>
  )
}

export default Board