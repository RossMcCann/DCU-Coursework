public class Arc<E>
{
    private Vertex<E> fromVertex;
    private Vertex<E> toVertex;
    private int weight;

    Arc(Vertex<E> fromVertex, Vertex<E> toVertex, int weight)
    {
        this.fromVertex = fromVertex;
        this.toVertex = toVertex;
        this.weight = weight;
    }

    // getters
    public Vertex<E> getFromVertex()
    {
        return fromVertex;
    }

    public Vertex<E> getToVertex()
    {
        return toVertex;
    }

    public int getWeight()
    {
        return weight;
    }
}
