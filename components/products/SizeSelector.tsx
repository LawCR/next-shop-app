import { FC } from 'react';
import { ISize } from '../../interfaces';
import { Box, Button } from '@mui/material';

interface Props {
    selectedSize?: ISize;
    sizes: ISize[];

    // Method
    OnSelectedSize: (size: ISize) => void;
}

export const SizeSelector: FC<Props> = ({selectedSize, sizes, OnSelectedSize}) => {
  return (
    <Box>
        {
            sizes.map(size => (
                <Button
                    key={ size }
                    size='small'
                    color={selectedSize === size ? 'primary' : 'info'}
                    onClick={ () => OnSelectedSize(size) }
                >
                    { size }
                </Button>
            ))
        }
    </Box>
  )
}
