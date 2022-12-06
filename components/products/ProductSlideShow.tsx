import { FC } from 'react';
import { Slide } from 'react-slideshow-image';

import 'react-slideshow-image/dist/styles.css';
// import styles from './productSlideshowStyle.module.css';
import './productSlideShowStyle.css';

interface Props {
    images: string[]
}

export const ProductSlideShow: FC<Props> = ({ images }) => {
  return (
    <Slide
        easing="ease"
        duration={7000}
        indicators
        pauseOnHover
    >
        {
            images.map( image =>  {
                // const url = `/products/${ image }`;
                const url = image
                return (
                    // <div className={ styles['each-slide'] } key={ image }>
                    <div className='each-slide' key={ image }>
                        <div style={{
                            backgroundImage: `url(${ url })`,
                            backgroundSize: 'cover'
                        }}>
                        </div>
                    </div>
                )

            })
        }

    </Slide>
  )
}