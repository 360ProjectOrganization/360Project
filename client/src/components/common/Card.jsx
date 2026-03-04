import "./Card.css";

export default function Card({ title, children, footer }) {
    return (
        <section className="card-container">
            {title && <h3 className="card-title">{title}</h3>}
            
            <div className="card-body">
                {children}
            </div>

            {footer && <div className="card-footer">{footer}</div>}
        </section>
    );
}