import { Box, Typography } from '@mui/material';

interface SjTextListProps {
  data: Record<string, string[]>;
  titleDisplay?: boolean;
  separator?: string;
}

const SjTitleAndSubTextList = ({ data, titleDisplay = true, separator = ', ' }: SjTextListProps) => (
  <>
    {Object.entries(data).map(([key, values]) => (
      <Box key={key} sx={{ mb: 3 }}>
        {titleDisplay && (
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
          </Typography>
        )}
        <Typography variant="body1">{values.join(separator)}</Typography>
      </Box>
    ))}
  </>
);

export default SjTitleAndSubTextList;
