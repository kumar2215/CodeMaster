import { toast } from 'react-toastify';

export default function processAndValidateQuestion(question, idx) {

  const i = idx ? idx + 1 : '';

  // check if there is a title
  if (!question.title) {
    toast.error(`Please set a title for question ${i}`, {autoClose: 3000});
    return false;
  }

  // check if there is a type
  if (!question.type) {
    toast.error(`Please set a type for question ${i}`, {autoClose: 3000});
    return false;
  }
  
  // check if there is a difficulty
  if (!question.difficulty) {
    toast.error(`Please set a difficulty for question ${i}`, {autoClose: 3000});
    return false;
  }

  // check if there is a language
  if (!question.language) {
    toast.error(`Please set a language for question ${i}`, {autoClose: 3000});
    return false;
  }

  // check if there is a source
  if (!question.source.src) {
    toast.error(`Please set a source for question ${i}`, {autoClose: 3000});
    return false;
  }

  // check if there is any content
  if (!question.contents.length) {
    toast.error(`Please set some content for question ${i}`, {autoClose: 3000});
    return false;
  }
  
  // check if given content is not empty
  for (let k = 0; k < question.contents.length; k++) {
    if (!question.contents[k] || question.contents[k].value.trim() === "") {
      toast.error(`Question ${i} has an empty content field`, {autoClose: 3000});
      return false;
    }
  }

  // check if there are any parts
  if (question.parts.length === 0) {
    toast.error(`Question ${i} has no parts`, {autoClose: 3000});
    return false;
  }

  let total_points = 0;
  question.parts.forEach((part) => {
    if (typeof part.points === 'object') {
      part.points.forEach((point) => {
        total_points += Number(point);
      });
    } else {
      total_points += Number(part.points);
    }
  });
  
  return {
    ...question,
    content: question.contents,
    points: total_points,
    source: {
      link: question.source.src.includes('/'),
      src: question.source.src
    },
    parts: question.parts.map((part, index) => {

      let partValue;
      if (question.parts.length === 1) {
        partValue = "null";
      } else {
        partValue = String.fromCharCode(index + 65).toLowerCase();
      }

      if (part.question === '') {
        toast.error(`Question ${i} part ${partValue} has no question`, {autoClose: 3000});
        return false;
      }

      if (part.questionType === "Multiple-Responses" || part.questionType === "Freestyle") {

        const pointsArray = part.points.map(point => Number(point));
        pointsArray.forEach(points => {
          if (points <= 0) {
            toast.error(`Question ${i} part ${partValue} has non-positive points`, {autoClose: 3000});
            return false;
          }
        })

        if (part.format === '') {
          toast.error(`Question ${i} part ${partValue} has an empty format`, {autoClose: 3000});
          return false;
        }
        const formatArray = part.format.split(',').map(f => f.trim() !== '' ? f.trim() : '').filter(f => f !== '');

        if (part.inputs.length === 0) {
          toast.error(`Question ${i} part ${partValue} has no inputs`, {autoClose: 3000});
          return false;
        }

        for (let j = 0; j < part.inputs.length; j++) {
          const input = part.inputs[j];
          for (let k = 0; k < formatArray.length; k++) {
            if (input[formatArray[k]] === undefined) {
              toast.error(`Question ${i} part ${partValue} input ${j+1} has missing field ${formatArray[k]}`, {autoClose: 3000});
              return false;
            }
          }
          if (input.expected === '' || input.expected === undefined) {
            toast.error(`Question ${i} part ${partValue} input ${j+1} has no expected field`, {autoClose: 3000});
            return false;
          }
        }

        if (part.questionType === "Freestyle") {
          // check if user code is present
          if (part.code === '') {
            toast.error(`Question ${i} part ${partValue} needs to have usercode`, {autoClose: 3000})
            return false;
          }

          // check if function name is present
          if (part.functionName === '') {
            toast.error(`Question ${i} part ${partValue} needs to have a main function name`, {autoClose: 3000})
            return false;
          }

          // check if user code has main function name
          if (!part.code.includes(part.functionName)) {
            toast.error(`Question ${i} part ${partValue}'s usercode needs to contain the main function name`, {autoClose: 3000})
            return false;
          }

          const pre_code = part.precode;
          const post_code = part.postcode;
          const refactoring = question.type === "Refactoring";

          return { ...part, part: partValue, points: pointsArray, format: formatArray, pre_code, post_code, refactoring, function_name: part.functionName };
        }

        return { ...part, part: partValue, points: pointsArray, format: formatArray };
      }

      if (part.questionType === "MCQ" || part.questionType === "MRQ") {

        // check if there are options
        if (!part.options || part.options.length === 0) {
          toast.error(`Question ${i} part ${partValue} has no options`, {autoClose: 3000});
          return false;
        }
        
        // check if options are not empty
        for (let k = 0; k < part.options.length; k++) {
          if (part.options[k].value.trim() === "") {
            toast.error(`Question ${i} part ${partValue} option ${k+1} is empty`, {autoClose: 3000});
            return false;
          }
        }

        // check if options contain duplicates
        const optionValues = part.options.map(option => option.value);
        if (new Set(optionValues).size !== optionValues.length) {
          toast.error(`Question ${i} part ${partValue} has duplicate options`, {autoClose: 3000});
          return false;
        }

        const points = Number(part.points);
        // check if points is positive
        if (points <= 0) {
          toast.error(`Question ${i} part ${partValue} has non-positive points`, {autoClose: 3000});
          return false;
        }

        const L = part.options.length;
        // check if expected option is within nunber of options
        if (part.questionType === "MCQ") {
          part.expected = Number(part.expected);
          if (part.expected <= 0 || part.expected > L) {
            toast.error(`Question ${i} part ${partValue}'s right option has to be within the option numbers`, {autoClose: 3000});
            return false;
          }
          return { ...part, part: partValue, expected: part.expected, points };
        }

        if (part.questionType === "MRQ") {
          const expectedArray = part.expected.split(',').map(val => Number(val.trim()));
          for (let k = 0; k < part.expected.length; k++) {
            if (expectedArray[k] <= 0 || expectedArray > L) {
              toast.error(`Question ${i} part ${partValue}\n Right option has to be within the option numbers`, {autoClose: 3000});
              return false;
            }
          }
          return { ...part, part: partValue, expected: expectedArray, points };
        }
      }

    })
  
  };

}