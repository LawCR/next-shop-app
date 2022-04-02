import { FC } from 'react';
import { Slide } from 'react-slideshow-image';

import 'react-slideshow-image/dist/styles.css';
import styles from './ProductSlideshow.module.css';

interface Props {
    images: string[]
}

//TODO: Falta arreglar lo del slide que no se mueve
export const ProductSlideShow: FC<Props> = ({ images }) => {
  return (
    <Slide
        easing="ease"
    >
        {
            images.map( image =>  {
                const url = `/products/${ image }`;
                return (
                    <div className={ styles['each-slide'] } key={ image }>
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