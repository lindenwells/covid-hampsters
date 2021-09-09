package LinearRegression;

import java.util.ArrayList;
/***comments */
public class LinearRegression {
    private int number;
    private double b, w, lRate;
    private ArrayList<Point> list;

    public LinearRegression() {
        this.b = 0;
        this.w = 0;
        this.number = 10000;
        this.lRate = 0.001;
        this.list = new ArrayList<Point>();
    }

    public double loss() {
        double loss = 0;
        int x, y;
        int size = list.size();
        for (int i = 0; i < size; i++) {
            x = list.get(i).x;
            y = list.get(i).y;
            loss += Math.pow(w*x + b - y, 2) / size;
        }

        return loss;
    }

    public double[] gradient() {
        double wGradient = 0, bGradient = 0, x, y;
        int size = list.size();
        for (int i = 0; i < size; i++) {
            x = list.get(i).x;
            y = list.get(i).y;
            wGradient += (2 / size) * ((w*x + b) - y) * x;
            bGradient += (2 / size) * ((w*x + b) - y);
        }
        return new double[]{wGradient, bGradient};
    }

    public void insert(int x, int y) {
        this.list.add(new Point(x, y));
    }

    public double[] result() {
        double wGradient = 0, bGradient = 0;
        double[] coordinate;
        for (int i = 0; i < number; i++) {
            coordinate = gradient();
            this.w = this.w - (lRate + coordinate[0]);
            this.b = this.b - (lRate + coordinate[1]);
        }

        return new  double[]{this.w, this.b};
    }

    public static void main(String[] strings) {
        LinearRegression linearRegression = new LinearRegression();
        //Add data here
        linearRegression.result();
    }

    class Point {
        public int x, y;
        public Point(int x, int y) {
            this.x = x;
            this.y = y;
        }
    }
}
