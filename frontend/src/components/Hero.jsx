import { Link } from 'react-router-dom';
import { Compass, Plus } from 'lucide-react';

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__content container">
        <p className="hero__eyebrow">Task Dashboard</p>
        <h1 id="hero-title">Your Tasks. Your Progress.</h1>
        <p className="hero__text">
          Plan it, track it, finish it. Everything you need to stay on top of your work, in one
          place.
        </p>
        <div className="hero__actions">
          <Link to="/tasks/new" className="btn btn-primary btn-lg">
            <Plus size={20} /> Create Task
          </Link>
          <Link to="/tasks" className="btn btn-secondary btn-lg">
            <Compass size={20} /> Explore Tasks
          </Link>
        </div>
      </div>
    </section>
  );
}