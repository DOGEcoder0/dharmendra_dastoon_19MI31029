import React, { useState } from 'react';
import './ComicStripGenerator.css';

async function query(data) {
  const response = await fetch(
    'https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud',
    {
      headers: {
        Accept: 'image/png',
        Authorization:
          'Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
  const result = await response.blob();
  return result;
}

function ComicStripGenerator() {
  const [comicPanels, setComicPanels] = useState(Array(10).fill(''));
  const [generatedComic, setGeneratedComic] = useState([]);

  const handleInputChange = (index, value) => {
    const updatedPanels = [...comicPanels];
    updatedPanels[index] = value;
    setComicPanels(updatedPanels);
  };

  const handleGenerateComic = async (e) => {
    e.preventDefault();

    try {
      const images = await Promise.all(comicPanels.map((text) => query({ inputs: text })));
      setGeneratedComic(images);
    } catch (error) {
      console.error(error);
      alert('Failed to generate comic strip. Please try again.');
    }
  };

  return (
    <div className= "App">
      <h1>Comic Strip Generator</h1>
      <form onSubmit={handleGenerateComic}>
        {comicPanels.map((text, index) => (
          <div key={index}>
            <label htmlFor={`panel${index + 1}`}>{`Panel ${index + 1}:`}</label>
            <input
              type="text"
              id={`panel${index + 1}`}
              value={text}
              onChange={(e) => handleInputChange(index, e.target.value)}
              required
            />
          </div>
        ))}
        <button type="submit">Generate Comic Strip</button>
      </form>

      <div className= "comicDisplay">
        {generatedComic.map((blob, index) => (
          <div key={index} className= "panel">
            <img src={URL.createObjectURL(blob)} alt={`Panel ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComicStripGenerator;
