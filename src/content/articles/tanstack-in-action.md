---
title: "TanStack in Action"
date: "August 27, 2025"
excerpt: "Developing a REST API with a shared module"
readTime: "4 min read"
category: "Node.js, Typescript, React"
---

## Introduction

        

          I have spent a disproportunate amount of time in the React space over
          the past several years. This usually involves interactions with APIs,
          specifically REST. The opportunity has provided me with some insight
          into how various teams are accomplishing this simple common operations
          across various projects such as interating with remote APIs and
          maintaining applicaition state. Given the open nature of React, there
          is no consistent defacto standard to performing these operations.
        

        

          In this article, I will cover my personal experience with the
          tankstack library, specifically query interaction and and state
          management. I won't attempt to create an formal tutorial here on
          the Tanstack libraries, and I also wont put in effort into history of
          the tankstack project, as this is readily available online in other
          places. Spoiler alert here, the experience has been positive, and I
          would enoucrage anyone not working with the project to make take a
          peek into the applied approaches covered here towards state management
          and API interactions as I really view this as an proven development
          approach.
        

        

## API interactions with useQuery

        

### The vanilla approach towards API interactions in React

        

          Let's look at a textbook example of loading ata in an functional
          component in React. Upon initialization.
        

        

[code]
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);
const [products, setProducts] = useState(null); 

useEffect(()=>{
    try {
        const response = await fetch('YOUR_API_ENDPOINT'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
},[])
[/code]

        

          So in the above example, we are taking a low level approach towards
          API interaction. First of all, we perform a brute force fetch api call
          within the page, and secondly, we track the status of the load
          operation, i.e. was it successfull? is it still loading?, etc. While
          this gets the job done, and appears in many examples and tutorials,
          the following points are areas for improvement with this appraoch.
        

        

          * Lower levels of call operations should be centralized into another
            file, enforcing separation of concearns between UI logic

          * Manual effort required to tracking loading state

          * Any effort for caching needs additional effort

        

        

Let's take another pass at an approach in the next section.

        

## A revised approach towards for UI interactions via TankStack useQuery

        

          So we will start with a new useQuery based approach. First and
          foremost, we split the low level request details into the
          'fetchProducts' method, which was migrated to a separate
          file. Line 22 performs the useQuery call which wrappers the underlying
          action.
        

        

[code]
/**
    product-service.ts:

    Logic is centralized into a sparate file concearned with the lower level details related to data retrieval.
*/
const fetchProducts = async () => {
  const response = await fetch('/api/products'); 
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }
  return response.json();
};

/**
    ProductListComponent.tsx:

    And now the end consumer implementation
*/

function ProductListComponent{
    ...
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['todos'], // Unique key for caching and refetching
        queryFn: fetchTodos, // The function that fetches the data
    });

}
[/code]

        

          So in the above example, the previous references to useState are gone.
          This is a cleaner approach, references to the resulting data, the
          state of the load request, and if and the nature of the error is
          assigned as a simple function call, managed by the underlying API
          details. The default variable names work in most cases, which is great
          as it provides consistency across simple use cases, however the aility
          to override the variable references is supported she the requirement
          arise.
        

        

          Another added benefit towards this library approach is the ability to
          manage caching. This requires a lot more additional logic when hand
          rolling which would be required in the initial approach. Line 23
          supplies the queryKey function, which provides a lot of power under
          the hood when it comes to fine tuning query operations. Caching and
          automatic refreshing is supported, with a range of options I will not
          attempt to cover here as it it well documented on the projects site
          (https://tanstack.com/query/v4/docs/framework/react/reference/useQuery).
        

        

          While the use cases for how and when to cache merit a separate
          discussion, it is worth noting the built in support with the library
          for caching, and the low level required to harness the required for
          implementing advanced caching functionality.
        

        

## Summary

        

          So I have hit on the hello world/boilerplate/example level approach
          that is ever present in blogs/tutorials/training courses. Well
          intended for illustration purposes, however not exactly production
          level code, however I have encountered this on many occasions.
        

        

          The above approach utilizing tankstack provide a solid path forward
          with data fetching from within React frontends.
        

        

          I would highly encourage anyone building projects in this space and
          consider drinking the coolaide on this one. Concise, consistent.
