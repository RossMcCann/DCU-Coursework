// imports
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Set;
import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;


public class DirectedWeightedGraph<E>
{
    // adjacecy list is a map with keys of a single vertex whos value is a list of all the arcs it points to
    private Map<Vertex<E>, List<Arc<E>>> adjacentList = new HashMap<>();

    void addVertex(Vertex<E> vertex)
    {
        adjacentList.putIfAbsent(vertex, new ArrayList<>()); 
    }

    void addArc(Vertex<E> from, Vertex<E> to, int weight)
    {
        Arc<E> arc = new Arc<>(from, to, weight);
        adjacentList.get(from).add(arc);
    }

    void deleteVertex(Vertex<E> vertex)
    {
        adjacentList.remove(vertex);

        /* 
         *  need to delete all arcs from other vertices to the vertex we are deleting
         *  to do this delete all arcs where the toVertex field is set to the vertex 
         *  that was passed to this method
        */
        for (List<Arc<E>> arcs : adjacentList.values())
        {
            // Lambda function finds an arc where the toVertex is <vertex>
            arcs.removeIf(arc -> arc.getToVertex().equals(vertex));
        }
    }

    void deleteArc(Vertex<E> from, Vertex<E> to)
    {
        // get the list of all paths possible from the from node
        List<Arc<E>> currVertexPaths = adjacentList.get(from);

        // lambda function that removes an arc if its toVertex matches
        currVertexPaths.removeIf(arc -> arc.getToVertex().equals(to));
    }

    // this method requires a call to a seperate helper method called dfs
    boolean cyclic()
    {
        // initialise sets for visited and recursion stack (Set allows for quick lookup time with .contains())
        // do not be confused recStack is not actually a typical Stack data structure
        Set<Vertex<E>> visited = new HashSet<>();
        Set<Vertex<E>> recStack = new HashSet<>();

        // iterate over each vertex in the graph
        for (Vertex<E> vertex : adjacentList.keySet())
        {
            // if the vertex has not been visited
            if (!visited.contains(vertex))
            {
                // call the helper dfs function
                if (dfs(vertex, visited, recStack))
                {
                    // if dfs() returns true the cyclic method returns true
                    return true;
                }
            }
        }
        // if dfs() returns false the cyclic method returns false
        return false;
    }

    // helper dfs method needed to test a graph for cycles
    boolean dfs(Vertex<E> vertex, Set<Vertex<E>> visited, Set<Vertex<E>> recStack)
    {
        // add current vertex to the visited and recStack sets
        visited.add(vertex);
        recStack.add(vertex);

        // get all of vertex neighbours
        List<Arc<E>> adjArcs = adjacentList.get(vertex);
        for (Arc<E> arc : adjArcs)
        {
            // if we have not visited a neigbour yet
            if (!visited.contains(arc.getToVertex()))
            {
                // use recursion to check each vertex until we find an already visited Vertex
                if (dfs(arc.getToVertex(), visited, recStack))
                {
                    return true;
                }
            }
            // if a neigbouring vertex is already in the recursion stack there is a cycle
            else if (recStack.contains(arc.getToVertex())) return true;
        }

        recStack.remove(vertex);

        return false;
    }

    List<Vertex<E>> shortestPath(Vertex<E> startVertex, Vertex<E> endVertex)
    {
        // previousMap keeps track of the order of the shortest route
        Map<Vertex<E>, Vertex<E>> previousMap = new HashMap<>();
        PriorityQueue<Vertex<E>> queue = new PriorityQueue<>();

        // ensure all vertices except startVertex distance field are set to "infinity" (MAX_VALUE)
        for (Vertex<E> vertex : adjacentList.keySet())
        {
            vertex.setDistance(Integer.MAX_VALUE);
        }
        startVertex.setDistance(0);

        // add the staring vertex to the search queue
        queue.add(startVertex);

        // runs while the queue is not empty (this is where Dijktra's algorithm starts)
        while (!queue.isEmpty())
        {
            Vertex<E> current = queue.poll();

            // found the shortes path straight away if start and end are the same
            if (current.equals(endVertex))
            {
                break;    
            }

            // move to the "closest" neigbour vertex
            for (Arc<E> arc : adjacentList.get(current))
            {
                Vertex<E> neighbour = arc.getToVertex();
                int distance = current.getDistance() + arc.getWeight();

                // only enters this block when we find a shorter route to the neigbour vertex
                if (distance < neighbour.getDistance())
                {
                    neighbour.setDistance(distance);
                    previousMap.put(neighbour, current);

                    // update the queue
                    queue.remove(neighbour);
                    queue.add(neighbour);
                }
            }
        }

        // endVertex value will still be MAX_VALUE if we could not reach it
        if (endVertex.getDistance() == Integer.MAX_VALUE)
        {
            // there is no path from startVertex to endVertex
            return new ArrayList<>();
        }

        /*
         * reconstruct the path using the previous map
         * start at the end and work backwards until you reach the start (stops when current == null)
         */
        List<Vertex<E>> path = new ArrayList<>();
        for (Vertex<E> current = endVertex; current != null; current = previousMap.get(current))
        {
            path.add(0, current);
        }

        return path;
    }

    Map<String, List<Vertex<E>>> allShortestPaths()
    {
        // returning a map with keys of a string of the vertices we're travelling and values of the list to the shortest route
        Map<String, List<Vertex<E>>> allPaths = new HashMap<>();

        for (Vertex<E> start : adjacentList.keySet())
        {
            for (Vertex<E> end : adjacentList.keySet())
            {
                // no need to output anything when the start and end vertex are the same
                if (start.equals(end)) continue;

                List<Vertex<E>> path = shortestPath(start, end);

                String vertices = "(" + start.getValue() + ", " + end.getValue() + ")";

                // if there is no path generate an empty list 
                if (path.isEmpty())
                {
                    allPaths.put(vertices, List.of());    
                }
                else
                {
                    allPaths.put(vertices, path);
                }
            }
        }

        return allPaths;
    }
    
    public Map<Vertex<E>, List<Arc<E>>> getAdjacentList()
    {
        return adjacentList;
    }
}
