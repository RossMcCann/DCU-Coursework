public class Vertex<E> implements Comparable<Vertex<E>>
{
    // distance field added to complete shortestPath method in DirectedWeightedGraph.Java
    private E value;
    private int distance;

    // on initialisation distance is set to MAX_VALUE to use in Dijkstra's algorithm for finding the shortest path
    Vertex(E value)
    {
        this.value = value;
        this.distance = Integer.MAX_VALUE;
    }

    // setters
    public void setDistance(int distance)
    {
        this.distance = distance;
    }

    // getters
    public E getValue()
    {
        return value;
    }

    public int getDistance()
    {
        return distance;
    }

    // must implement compareTo from the implemented Comparable interface
    public int compareTo(Vertex<E> other)
    {
        return Integer.compare(this.distance, other.distance);
    }

    // string representation of a vertex is just its value field
    public String toString()
    {
        return value.toString();
    }
}
